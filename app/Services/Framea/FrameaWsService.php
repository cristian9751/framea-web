<?php

namespace App\Services\Framea;

use Amp\Cancellation;
use Amp\CancelledException;
use Amp\DeferredFuture;
use Amp\TimeoutCancellation;
use Amp\Websocket\Client\WebsocketConnection;
use Amp\Websocket\WebsocketMessage;
use App\abstract\interfaces\services\IFrameaWsService;
use function Amp\async;
use function Amp\delay;

/**
 * Low-level persistent WebSocket client for the Framea network.
 *
 * This is the transport layer only:
 * - Auto-reconnect with exponential backoff (1s -> max).
 * - Routes inbound envelopes ({Type, Payload, Timestamp, CorrelationId})
 *   to registered handlers (exact match first, then prefix/wildcard).
 * - request(): generic request/reply used by domain services (permissions,
 *   sanctions, core...). Replies resolve the matching pending CorrelationId
 *   before handlers are invoked.
 *
 * Domain services (e.g. PermissionService) wrap request() into typed methods.
 */
final class FrameaWsService implements IFrameaWsService
{
    /** @var list<array{type:string, handler:callable(array):void}> */
    private array $handlers = [];

    /** @var array<string, DeferredFuture> CorrelationId => pending reply */
    private array $pending = [];

    private ?WebsocketConnection $connection = null;

    private ?string $heartbeatWatcher = null;

    public function __construct(
        private readonly string $uri,
        private readonly int $maxReconnectDelay = 30,
        private readonly int $heartbeatInterval = 30,
        private readonly float $requestTimeout = 5.0,
    ) {
    }

    /**
     * Register a handler for a message type. Type may be an exact name
     * ("perm.response") or a prefix ending in "*" ("perm.*", "*") which
     * matches every type starting with the prefix.
     */
    public function on(string $type, callable $handler): void
    {
        $this->handlers[] = ['type' => $type, 'handler' => $handler];
    }

    public function isConnected(): bool
    {
        return $this->connection !== null && !$this->connection->isClosed();
    }

    /**
     * Blocking main loop: connect, consume messages, reconnect on failure.
     * $onConnected is spawned as a coroutine the first time a connection is
     * established (and again after each reconnect) so callers can issue
     * request() calls from outside the receive loop.
     */
    public function run(?Cancellation $shutdown = null, ?callable $onConnected = null): void
    {
        $attempt = 0;

        while (!$this->isShutdown($shutdown)) {
            $connection = null;

            try {
                $connection = connect($this->uri, $shutdown);
                $this->connection = $connection;
                $attempt = 0;

                $this->startHeartbeat($connection);
                Log::info("Connected to {$this->uri}");

                if ($onConnected !== null) {
                    async($onConnected);
                }

                foreach ($connection as $message) {
                    if ($this->isShutdown($shutdown)) {
                        break;
                    }
                    $this->handleMessage($connection, $message);
                }

                Log::warn('Connection closed by peer.');
            } catch (CancelledException) {
                break;
            } catch (\Throwable $e) {
                if ($this->isShutdown($shutdown)) {
                    break;
                }

                $attempt++;
                $delay = $this->backoffDelay($attempt);
                Log::error(
                    "Connection failed: {$e->getMessage()} — retry in {$delay}s (attempt {$attempt})",
                );

                try {
                    delay($delay * 1000, $shutdown);
                } catch (CancelledException) {
                    break;
                }
            } finally {
                $this->stopHeartbeat();
                $this->connection = null;
                if ($connection !== null && !$connection->isClosed()) {
                    try {
                        $connection->close();
                    } catch (\Throwable) {
                        // ignore close errors during teardown
                    }
                }
            }
        }

        Log::info('Service stopped.');
    }

    /**
     * Send a framea action envelope and wait for the correlated response.
     * Used by domain services to perform request/reply operations.
     *
     * @param array<string, mixed> $payload Envelope payload, e.g. ["Action" => "check", ...]
     * @return array<string, mixed> The reply envelope payload (WsResponse shape)
     */
    public function request(string $type, array $payload, float $timeout = 0.0): array
    {
        $connection = $this->connection;
        if ($connection === null || $connection->isClosed()) {
            throw new \RuntimeException('Not connected');
        }

        $correlationId = self::newUuid();
        $deferred = new DeferredFuture();
        $this->pending[$correlationId] = $deferred;

        $this->sendEnvelope($connection, $type, $payload, $correlationId);

        $seconds = $timeout > 0.0 ? $timeout : $this->requestTimeout;

        try {
            $reply = $deferred->getFuture()->await(
                new TimeoutCancellation((int) \round($seconds * 1000)),
            );
            return $reply['Payload'] ?? $reply;
        } catch (CancelledException) {
            throw new \RuntimeException("WS request '{$type}' timed out");
        } finally {
            unset($this->pending[$correlationId]);
        }
    }

    private function handleMessage(WebsocketConnection $connection, WebsocketMessage $message): void
    {
        $raw = $message->buffer();
        $envelope = json_decode($raw, true);

        if (!\is_array($envelope)) {
            Log::warn('Ignoring non-JSON message', ['raw' => \substr($raw, 0, 512)]);
            return;
        }

        $type = isset($envelope['Type']) ? (string) $envelope['Type'] : '';
        if ($type === '') {
            return;
        }

        $correlationId = isset($envelope['CorrelationId'])?(string) $envelope['CorrelationId']:null;

        if ($correlationId !== null && isset($this->pending[$correlationId])) {
            $this->pending[$correlationId]->complete($envelope);
            return;
        }

        $this->dispatch($type, $envelope);
    }

    private function dispatch(string $type, array $envelope): void
    {
        $exact = null;
        $prefixes = [];

        foreach ($this->handlers as $registration) {
            $handlerType = $registration['type'];

            if ($handlerType === $type) {
                $exact = $registration;
                break;
            }

            if (\str_ends_with($handlerType, '*')) {
                $prefixes[] = [$handlerType, $registration];
            }
        }

        if ($exact !== null) {
            $exact['handler']($envelope);
            return;
        }

        foreach ($prefixes as [$handlerType, $registration]) {
            $prefix = \substr($handlerType, 0, -1);
            if (\str_starts_with($type, $prefix)) {
                $registration['handler']($envelope);
                return;
            }
        }

        Log::debug("No handler for type '{$type}'");
    }

    private function startHeartbeat(WebsocketConnection $connection): void
    {
        if ($this->heartbeatInterval <= 0) {
            return;
        }

        $this->heartbeatWatcher = EventLoop::repeat($this->heartbeatInterval, static function () use ($connection): void {
            if ($connection->isClosed()) {
                return;
            }

            $connection->sendText(\json_encode([
                'Type' => 'heartbeat',
                'Payload' => ['Timestamp' => \gmdate('c')],
            ]));
        });
    }

    private function stopHeartbeat(): void
    {
        if ($this->heartbeatWatcher !== null) {
            EventLoop::cancel($this->heartbeatWatcher);
            $this->heartbeatWatcher = null;
        }
    }

    private function sendEnvelope(WebsocketConnection $connection, string $type, array $payload, ?string $correlationId = null): void
    {
        $envelope = [
            'Type' => $type,
            'Payload' => $payload,
            'Timestamp' => \gmdate('c'),
        ];

        if ($correlationId !== null) {
            $envelope['CorrelationId'] = $correlationId;
        }

        $connection->sendText(\json_encode($envelope, JSON_UNESCAPED_SLASHES));
    }

    private function isShutdown(?Cancellation $shutdown): bool
    {
        return $shutdown !== null && $shutdown->isRequested();
    }

    private function backoffDelay(int $attempt): int
    {
        $exponent = \min($attempt - 1, 10);
        $seconds = 1 << $exponent;

        return \min($seconds, $this->maxReconnectDelay);
    }

    private static function newUuid(): string
    {
        $bytes = \random_bytes(16);
        $bytes[6] = \chr((\ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = \chr((\ord($bytes[8]) & 0x3f) | 0x80);

        return \vsprintf('%s%s-%s-%s-%s-%s%s%s', \str_split(\bin2hex($bytes), 4));
    }
}

<?php

namespace App\Services\Framea;

use Amp\Cancellation;
use Amp\CancelledException;
use Amp\DeferredFuture;
use Amp\Http\Server\DefaultErrorHandler;
use Amp\Http\Server\Request;
use Amp\Http\Server\RequestHandler;
use Amp\Http\Server\Response;
use Amp\Http\Server\SocketHttpServer;
use Amp\Socket\InternetAddress;
use Amp\Socket\UnixAddress;
use Amp\Websocket\Server\Rfc6455Acceptor;
use Amp\Websocket\Server\Websocket;
use Amp\Websocket\Server\WebsocketClientHandler;
use Amp\Websocket\WebsocketClient;
use Amp\Websocket\WebsocketMessage;
use App\abstract\interfaces\services\IFrameaWsService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;
use Revolt\EventLoop;

use function Amp\async;
use function Amp\Dns\resolve;
use function Amp\Socket\SocketAddress\fromString;

/**
 * Persistent WebSocket server for the Framea network.
 *
 * Framea acts as the WebSocket client and connects to this server.
 *
 * The web processes (PHP-FPM) and the long-lived WS server process do not
 * share memory, so traffic is bridged through Redis:
 *
 * - request(): the web process pushes the envelope to the "framea:requests"
 *   queue and polls "framea:reply:{correlationId}" until the reply arrives
 *   (or times out). It can also be called from the server process itself.
 * - The WS server process pops the queue and sends each envelope to a
 *   connected Framea client. Replies received on the socket are written to
 *   Redis so the waiting web process can resolve them.
 * - handlers: inbound envelopes WITHOUT a CorrelationId are dispatched to
 *   registered handlers (exact match first, then prefix/wildcard).
 *
 * Domain services (e.g. PermissionService) wrap request() into typed methods.
 */
final class FrameaWsService implements IFrameaWsService
{
    private const CONNECTIONS_KEY = 'framea:connections';

    private const REQUESTS_KEY = 'framea:requests';

    private const REPLY_KEY_PREFIX = 'framea:reply:';

    private const REPLY_TTL = 60;

    private const PUMP_INTERVAL = 0.1;

    /** @var list<array{type:string, handler:callable(array):void}> */
    private array $handlers = [];

    /** @var array<int, WebsocketClient> Connected Framea clients indexed by client id */
    private array $clients = [];

    private ?string $heartbeatWatcher = null;

    private ?string $pumpWatcher = null;

    private ?SocketHttpServer $server = null;

    /** @var callable():void|null */
    private $onConnected = null;

    public function __construct(
        private readonly string $host = 'localhost',
        private readonly int $port = 993,
        private readonly string $path = '/ws',
        private readonly int $heartbeatInterval = 30,
        private readonly float $requestTimeout = 5.0,
    ) {}

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
        try {
            return (int) Redis::scard(self::CONNECTIONS_KEY) > 0;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Blocking main loop: start the WebSocket server, pump queued requests to
     * connected Framea clients and keep running until $shutdown is requested.
     * $onConnected is spawned as a coroutine each time a Framea client connects
     * so callers can issue request() calls from outside the receive loop.
     */
    public function run(?Cancellation $shutdown = null, ?callable $onConnected = null): void
    {
        $this->onConnected = $onConnected;

        $logger = Log::getFacadeRoot();
        if (! $logger instanceof LoggerInterface) {
            $logger = new NullLogger;
        }

        $server = SocketHttpServer::createForDirectAccess($logger);

        $clientHandler = new class($this) implements WebsocketClientHandler
        {
            public function __construct(private readonly FrameaWsService $service) {}

            public function handleClient(WebsocketClient $client, Request $request, Response $response): void
            {
                $this->service->handleClientConnection($client);
            }
        };

        $endpoint = new Websocket($server, $logger, new Rfc6455Acceptor, $clientHandler);

        $requestHandler = new class($endpoint, $this->path) implements RequestHandler
        {
            public function __construct(
                private readonly RequestHandler $websocket,
                private readonly string $path,
            ) {}

            public function handleRequest(Request $request): Response
            {
                if ($this->path === '' || $request->getUri()->getPath() === $this->path) {
                    return $this->websocket->handleRequest($request);
                }

                return new Response(404, ['content-type' => 'text/plain'], 'Not Found');
            }
        };

        $bindAddress = "{$this->host}:{$this->port}";
        $server->expose($this->resolveBindAddress());
        $server->start($requestHandler, new DefaultErrorHandler);

        $this->server = $server;

        $this->startHeartbeat();
        $this->startRequestPump();

        Log::info("WebSocket server listening on {$bindAddress}{$this->path}");

        try {
            $this->awaitShutdown($shutdown);
        } finally {
            $this->stopRequestPump();
            $this->stopHeartbeat();
            $server->stop();
            $this->server = null;
            $this->clients = [];
        }

        Log::info('Service stopped.');
    }

    /**
     * Send a framea action envelope and wait for the correlated response.
     *
     * The envelope is queued in Redis for the WS server process, which forwards
     * it to the first connected Framea client. The reply is written back to
     * Redis by the server process and resolved here.
     *
     * @param  array<string, mixed>  $payload  Envelope payload, e.g. ["Action" => "check", ...]
     * @param  string|null  $correlationId  Optional explicit correlation id (useful for tests/idempotency).
     * @return array<string, mixed> The reply envelope payload (WsResponse shape)
     */
    public function request(string $type, array $payload, float $timeout = 0.0, ?string $correlationId = null): array
    {
        if (! $this->isConnected()) {
            throw new \RuntimeException('Not connected');
        }

        $correlationId ??= self::newUuid();
        $seconds = $timeout > 0.0 ? $timeout : $this->requestTimeout;

        $envelope = [
            'Type' => $type,
            'Payload' => $payload,
            'Timestamp' => \gmdate('c'),
            'CorrelationId' => $correlationId,
        ];

        Redis::rpush(self::REQUESTS_KEY, \json_encode($envelope, JSON_UNESCAPED_SLASHES));

        $deadline = \microtime(true) + $seconds;

        while (\microtime(true) < $deadline) {
            $reply = $this->fetchReply($correlationId);

            if ($reply !== null) {
                return $reply['Payload'] ?? $reply;
            }

            \usleep(20_000);
        }

        throw new \RuntimeException("WS request '{$type}' timed out");
    }

    /**
     * Receive loop for a single connected Framea client. Invoked as a
     * coroutine per connection by the websocket endpoint.
     *
     * @internal
     */
    public function handleClientConnection(WebsocketClient $client): void
    {
        $id = $client->getId();
        $this->clients[$id] = $client;
        Redis::sadd(self::CONNECTIONS_KEY, (string) $id);

        $counted = true;

        $client->onClose(function (int $clientId) use (&$counted): void {
            unset($this->clients[$clientId]);

            if ($counted) {
                Redis::srem(self::CONNECTIONS_KEY, (string) $clientId);
                $counted = false;
            }

            Log::info("Framea client #{$clientId} disconnected.");
        });

        Log::info("Framea client connected from {$client->getRemoteAddress()->toString()}.");

        if ($this->onConnected !== null) {
            async($this->onConnected);
        }

        try {
            while (($message = $client->receive()) !== null) {
                $this->handleMessage($client, $message);
            }
        } catch (CancelledException) {
            // ignore
        } catch (\Throwable $e) {
            Log::error('Framea client error: '.$e->getMessage(), ['exception' => $e]);
        } finally {
            unset($this->clients[$id]);

            if ($counted) {
                Redis::srem(self::CONNECTIONS_KEY, (string) $id);
                $counted = false;
            }
        }
    }

    private function handleMessage(WebsocketClient $client, WebsocketMessage $message): void
    {
        $raw = $message->buffer();
        $envelope = json_decode($raw, true);

        if (! \is_array($envelope)) {
            Log::warn('Ignoring non-JSON message', ['raw' => \substr($raw, 0, 512)]);

            return;
        }

        $type = isset($envelope['Type']) ? (string) $envelope['Type'] : '';
        if ($type === '') {
            return;
        }

        $correlationId = isset($envelope['CorrelationId']) ? (string) $envelope['CorrelationId'] : null;

        if ($correlationId !== null) {
            Redis::setex(self::replyKey($correlationId), self::REPLY_TTL, $raw);

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

    private function startHeartbeat(): void
    {
        if ($this->heartbeatInterval <= 0) {
            return;
        }

        $this->heartbeatWatcher = EventLoop::repeat($this->heartbeatInterval, function (): void {
            foreach ($this->clients as $client) {
                if ($client->isClosed()) {
                    continue;
                }

                try {
                    $client->sendText(\json_encode([
                        'Type' => 'heartbeat',
                        'Payload' => ['Timestamp' => \gmdate('c')],
                    ]));
                } catch (\Throwable) {
                    // ignore failed heartbeats
                }
            }
        });
    }

    private function stopHeartbeat(): void
    {
        if ($this->heartbeatWatcher !== null) {
            EventLoop::cancel($this->heartbeatWatcher);
            $this->heartbeatWatcher = null;
        }
    }

    /**
     * Periodically forward queued web requests to a connected Framea client.
     * If no client is connected the queue is left untouched.
     */
    private function startRequestPump(): void
    {
        $this->pumpWatcher = EventLoop::repeat(self::PUMP_INTERVAL, function (): void {
            try {
                while (true) {
                    $heads = Redis::lrange(self::REQUESTS_KEY, 0, 0);

                    if (! \is_array($heads) || $heads === []) {
                        break;
                    }

                    $client = $this->currentClient();
                    if ($client === null) {
                        break;
                    }

                    $raw = (string) $heads[0];
                    Redis::lpop(self::REQUESTS_KEY);

                    try {
                        $client->sendText($raw);
                    } catch (\Throwable) {
                        Redis::lpush(self::REQUESTS_KEY, $raw);

                        break;
                    }
                }
            } catch (\Throwable $e) {
                Log::error('Framea request pump error: '.$e->getMessage(), ['exception' => $e]);
            }
        });
    }

    private function stopRequestPump(): void
    {
        if ($this->pumpWatcher !== null) {
            EventLoop::cancel($this->pumpWatcher);
            $this->pumpWatcher = null;
        }
    }

    private function fetchReply(string $correlationId): ?array
    {
        $key = self::replyKey($correlationId);
        $raw = Redis::get($key);

        if ($raw === null || $raw === false || $raw === '') {
            return null;
        }

        Redis::del($key);

        $reply = \json_decode((string) $raw, true);

        return \is_array($reply) ? $reply : null;
    }

    private function currentClient(): ?WebsocketClient
    {
        foreach ($this->clients as $client) {
            if (! $client->isClosed()) {
                return $client;
            }
        }

        return null;
    }

    /**
     * Resolve the configured host/port into a bindable socket address.
     * IP literals are accepted as-is; hostnames are resolved via DNS.
     */
    private function resolveBindAddress(): InternetAddress
    {
        $address = fromString("{$this->host}:{$this->port}");

        if (! $address instanceof UnixAddress) {
            return $address;
        }

        $ips = resolve($this->host);

        if ($ips === []) {
            throw new \RuntimeException("Unable to resolve WS bind host '{$this->host}'");
        }

        return new InternetAddress($ips[0]->getValue(), $this->port);
    }

    private function awaitShutdown(?Cancellation $shutdown): void
    {
        $deferred = new DeferredFuture;

        if ($shutdown !== null && $shutdown->isRequested()) {
            return;
        }

        if ($shutdown !== null) {
            $id = $shutdown->subscribe(fn () => $deferred->complete());

            try {
                $deferred->getFuture()->await();
            } finally {
                $shutdown->unsubscribe($id);
            }

            return;
        }

        $deferred->getFuture()->await();
    }

    private static function replyKey(string $correlationId): string
    {
        return self::REPLY_KEY_PREFIX.$correlationId;
    }

    private static function newUuid(): string
    {
        $bytes = \random_bytes(16);
        $bytes[6] = \chr((\ord($bytes[6]) & 0x0F) | 0x40);
        $bytes[8] = \chr((\ord($bytes[8]) & 0x3F) | 0x80);

        return \vsprintf('%s%s-%s-%s-%s-%s%s%s', \str_split(\bin2hex($bytes), 4));
    }
}

<?php

namespace App\Console\Commands;

use Amp\DeferredCancellation;
use App\abstract\interfaces\services\IFrameaWsService;
use Illuminate\Console\Command;

class FrameaWs extends Command
{
    protected $signature = 'framea:ws';

    protected $description = 'Inicia el servidor WebSocket de Framea (proceso de larga vida, puente via Redis).';

    public function handle(IFrameaWsService $ws): int
    {
        $shutdown = new DeferredCancellation;

        if (\function_exists('pcntl_async_signals') && \function_exists('pcntl_signal')) {
            pcntl_async_signals(true);
            pcntl_signal(\SIGINT, fn () => $shutdown->cancel());
            pcntl_signal(\SIGTERM, fn () => $shutdown->cancel());
        }

        $this->info('Starting Framea WebSocket server...');

        try {
            $ws->run(
                $shutdown->getCancellation(),
                fn () => $this->info('Framea client connected (ready to receive requests).'),
            );
        } catch (\Throwable $e) {
            $this->error("Framea WebSocket server error: {$e->getMessage()}");

            return self::FAILURE;
        } finally {
            $this->info('Framea WebSocket server stopped.');
        }

        return self::SUCCESS;
    }
}

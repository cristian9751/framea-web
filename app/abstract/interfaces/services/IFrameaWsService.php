<?php

namespace App\abstract\interfaces\services;

interface IFrameaWsService
{
    /**
     * Registra un handler para un tipo de mensaje.
     *
     * Puede ser un tipo exacto ("perm.response") o un prefijo
     * terminado en "*" ("perm.*", "*").
     *
     * @param callable(array<string, mixed>): void $handler
     */
    public function on(string $type, callable $handler): void;

    /**
     * Indica si existe una conexión WebSocket activa.
     */
    public function isConnected(): bool;

    /**
     * Ejecuta el loop de conexión, recepción y reconexión.
     *
     * @param callable(): void|null $onConnected
     */
    public function run(
        ?Cancellation $shutdown = null,
        ?callable $onConnected = null,
    ): void;

    /**
     * Envía una petición y espera su respuesta correlacionada.
     *
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    public function request(
        string $type,
        array $payload,
        float $timeout = 0.0,
    ): array;
}

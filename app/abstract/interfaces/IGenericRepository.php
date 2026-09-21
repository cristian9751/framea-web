<?php

namespace App\abstract\interfaces;

use Illuminate\Database\Eloquent\Model;

interface IGenericRepository
{
    public function create(
        array $data,
        ?array $idAttributes = null,
        ?callable $alreadyExists = null
    ): Model;

    public function delete(int $id): bool;

    public function getById(int $id): ?Model;

    public function getAll(): array;
}

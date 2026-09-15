<?php

namespace App\abstract\interfaces\services;



use App\dto\AbstractDTO;
use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 * @template TDTO of AbstractDTO
 */
interface IService
{
    /**
     * @param TDTO $dto
     * @return TModel
     */
    public function save(AbstractDTO $dto): Model;

    public function delete(int $id): bool;

    /**
     * @return TModel
     */
    public function getById(int $id): Model;

    public function getAll() : array;
}

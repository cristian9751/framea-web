<?php

namespace App\abstract\interfaces\services;


use App\dto\CreateProductDTO;
use App\Models\Product;

/**
 * @template TModel of Product
 * @template TDTO of CreateProductDTO
 */
interface IProductService extends IService
{
    /**
     * @param CreateProductDTO $dto
     * @return Product
     */
    public function save(CreateProductDTO|\App\dto\AbstractDTO $dto): Product;

    public function delete(int $id): bool;

    /**
     * @return Product
     */
    public function getById(int $id): Product;
}


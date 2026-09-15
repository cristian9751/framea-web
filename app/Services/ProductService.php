<?php

namespace App\Services;

use App\abstract\interfaces\services\IProductService;
use App\dto\AbstractDTO;
use App\dto\CreateProductDTO;
use App\Exceptions\AlreadyExists;
use App\Exceptions\NotExists;
use App\Models\Product;
use App\repository\GenericRepository;
use Illuminate\Support\Facades\DB;

class ProductService implements IProductService
{


    private GenericRepository $repository;
    public function __construct(
         GenericRepository $repository
    )
    {
        $this->repository = $repository;
    }


    /**
     * @throws NotExists
     */
    public function getById(int $id): Product {
        $product = $this->repository->getById($id);
        if(is_null($product)) {
            throw new NotExists(
                modelName: "Product",
                valueName: "id",
                value: $id
            );
        }
        assert($product instanceof Product);
        return $product;
    }

    public function save(CreateProductDTO | AbstractDTO $dto): Product {
        assert($dto instanceof CreateProductDTO);
        return DB::transaction(function () use ($dto) {
            $product =   $this->repository->create($dto->toArray(),
                 [
                    'name' => $dto->getName(),
                    'slug' => $dto->getSlug(),
                ],
                function($e, $data) {
                    throw new AlreadyExists(
                        value: "Product",
                        parameterName: $e->getIndex(),
                        parameterValue: $data[$e->getIndex()]
                    );
                }
            );
            assert($product instanceof Product);
            $product->productPrices()->create($dto->getPrices());
            return $product->load('productPrices');
        });
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }

    public function getAll(): array
    {
        return $this->repository->getAll();
    }
}

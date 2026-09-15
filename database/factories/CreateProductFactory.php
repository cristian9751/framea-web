<?php

namespace Database\Factories;

use App\dto\CreateProductDTO;

class CreateProductFactory
{
    public static function make(array $overrides = []): array
    {
        return array_merge([
            'name' => fake()->name(),
            'description' => fake()->text(),
            'prices' => [
                'billing_type_id' => 1,
                'base_price' => fake()->numberBetween(1, 100),
            ],
            'metadata' => [
                'some_metadata' => 'Some metadata',
            ],
            'slug' => fake()->slug(),
            'categoryId' => 1,
            'isFeatured' => false,
        ], $overrides);
    }
}

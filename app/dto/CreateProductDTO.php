<?php

namespace App\dto;

class CreateProductDTO extends AbstractDTO
{
    private string $name;
    private string $description;

    private array $prices;

    private array $metadata;


    private string $slug;

    private int $categoryId;

    private bool $isFeatured;

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }



    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getPrices(): array
    {
        return $this->prices;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }


    public function getIsFeatured(): string
    {
        return $this->isFeatured;
    }



    /**
     * @param string $name
     * @param string $description
     * @param array $prices
     * @param array $metadata
     * @param string|null $slug
     * @param int $categoryId
     * @param bool $isFeatured
     */
    private function __construct(string $name, string $description, array $prices, array $metadata, ?string $slug, int $categoryId, bool $isFeatured)
    {
        $this->name = $name;
        $this->description = $description;
        $this->prices = $prices;
        $this->metadata = $metadata;
        $this->slug = $slug;
        $this->categoryId = $categoryId;
        $this->isFeatured = $isFeatured;
    }


    public static  function fromArray(array $array): CreateProductDTO
    {
        return new self(
            $array['name'],
            $array['description'],
            $array['prices'],
            $array['metadata'] ?? [],
            $array['slug'],
            $array['categoryId'],
            $array['isFeatured'] ?? false


        );
    }

    public   function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'prices' => $this->prices,
            'metadata' => $this->metadata ?? [],
            'slug' => $this->slug,
            'product_category_id' => $this->categoryId,
            'is_featured' => $this->isFeatured
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
            ],

            'categoryId' => [
                'required',
                'integer',
            ],

            'prices' => [
                'required',
                'array',
            ],

            'metadata' => [
                'required',
                'array'
            ],

            'prices.billing_type_id' => [
                'required',
                'integer',
            ],

            'prices.base_price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'is_featured' => [
                'boolean',
            ]
        ];
    }
}

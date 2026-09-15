<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'specific_metadata_keys',
    ];

    protected $casts = [
        'specific_metadata_keys' => 'array',
    ];
}

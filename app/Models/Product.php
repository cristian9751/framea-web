<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'product_category_id',
        'slug',
        'image',
        'metadata',
        'is_featured',
        'is_active'
    ];
    protected $casts = [
        'metadata' => 'array',
    ];
    public function productPrices() : HasMany  {
        return $this->hasMany(ProductPrice::class);
    }

    public function licenses() : HasMany {
        return $this->hasMany(License::class);
    }

    public function category() :  BelongsTo {
        return  $this->belongsTo(ProductCategory::class);
    }
}

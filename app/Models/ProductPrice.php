<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductPrice extends Model
{
    protected $fillable = [
        'base_price',
        'issue_license',
        'billing_type_id'
    ];

    public function product() : BelongsTo {
        return $this->belongsTo(Product::class);
    }

    public function billingType() : BelongsTo {
        return $this->belongsTo(BillingType::class);
    }

}

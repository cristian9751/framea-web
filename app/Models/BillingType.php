<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingType extends Model
{
    protected $fillable = [
        'billing_interval_days',
        'name',
        'is_active',
    ];
}

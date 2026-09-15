<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Subscription extends Model
{


    protected $fillable =  [
        'last_renewal_date',
    ];
    public function user() : BelongsTo {
        return $this->BelongsTo(User::class);
    }

    public function billingType() : BelongsTo {
        return $this->BelongsTo(BillingType::class);
    }

    public function subscriptionItems() : HasMany {
        return $this->hasMany(SubscriptionItem::class);
    }
}

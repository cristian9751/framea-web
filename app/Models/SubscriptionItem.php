<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SubscriptionItem extends Model
{
    public function subscription() : BelongsTo {
        return $this->belongsTo(Subscription::class);
    }

    public function product() : BelongsTo {
        return $this->belongsTo(Product::class);
    }

    public function license() : BelongsTo {
        return $this->belongsTo(License::class);
    }
}

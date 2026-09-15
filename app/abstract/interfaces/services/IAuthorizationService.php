<?php

namespace App\abstract\interfaces\services;

use App\Enum\Actions;
use App\Models\User;

interface IAuthorizationService
{
    public function handleAuthorization( User $user, Actions $action, string $ownerId ): bool;
}

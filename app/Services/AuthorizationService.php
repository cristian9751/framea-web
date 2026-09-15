<?php

namespace App\Services;

use App\abstract\interfaces\services\IAuthorizationService;
use App\abstract\interfaces\services\IUserService;
use App\Enum\Actions;
use App\Models\User;

class AuthorizationService implements IAuthorizationService
{

    public function __construct(
        private IUserService $userService,
    )
    {

    }


    public function handleAuthorization(User $user, Actions $action, string $ownerId): bool {
        if($ownerId == $user->getKey()) return true;
        $role = $this->userService->getById($user->getKey())->role()->first();
        if($role == null) return false;
        $rolePermissionIds = $role->permissions->pluck('id')->all();
        foreach ($action->permissions() as $permission) {
            if (in_array($permission->value, $rolePermissionIds, true)) {
                return true;
            }
        }

        return false;



    }
}

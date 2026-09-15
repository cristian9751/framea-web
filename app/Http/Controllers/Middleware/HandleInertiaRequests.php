<?php

namespace App\Http\Controllers\Middleware;

use App\Enum\Actions;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }


    private function getUserPermissions(mixed $user): array
    {
        $user_permissions = [];
        foreach(Actions::cases() as $action) {
            $user_permissions = [
                ...$user_permissions,
                $action->value => $user->can($action->value),
            ];

        }
        return $user_permissions;
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'name' => $user->name,
                    'discord_id' => $user->discord_id,
                    'steam_id' => $user->steam_id,
                ] : null,

            ],
            'perms' => $user ? $this->getUserPermissions($user): null
        ]);
    }
}

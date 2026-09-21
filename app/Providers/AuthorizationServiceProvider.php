<?php

namespace App\Providers;

use App\abstract\interfaces\services\IAuthorizationService;
use App\Enum\Actions;
use App\Services\AuthorizationService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthorizationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->singleton(IAuthorizationService::class, function ($app) {
            return new AuthorizationService( $app->make(UserService::class));
        });

        foreach (Actions::cases() as $action) {
            Gate::define($action->value, function ($user, $ownerId = "-1") use ($action) {
                return app(IAuthorizationService::class)->handleAuthorization($user, $action, $ownerId);

            } );
        }
    }
}

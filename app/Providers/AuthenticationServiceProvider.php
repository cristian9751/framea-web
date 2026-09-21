<?php

namespace App\Providers;

use App\abstract\interfaces\services\IAuthenticationService;
use App\abstract\OAuthAuthenticationProvider;
use App\Enum\AuthenticatorProvider;
use App\Services\Authentication\AuthenticationService;
use App\Services\Authentication\DiscordAuthenticationProvider;
use App\Services\UserService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AuthenticationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {





        $this->app->singleton(IAuthenticationService::class, function ($app) {
            return new AuthenticationService(
                collect(AuthenticatorProvider::cases())
                    ->mapWithKeys(fn (AuthenticatorProvider $provider) => [
                        $provider->name => $app->make($provider->value)
                    ])
                    ->all(),
                $app->make(UserService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Event::listen(function(\SocialiteProviders\Manager\SocialiteWasCalled $event) {
            $event->extendSocialite('discord', \SocialiteProviders\Discord\Provider::class);
        });

        Event::Listen(function(\SocialiteProviders\Manager\SocialiteWasCalled $event) {
            $event->extendSocialite('steam', \SocialiteProviders\Steam\Provider::class);
        });
    }
}

<?php

namespace App\Providers;

use App\abstract\interfaces\IGenericRepository;
use App\abstract\interfaces\services\IFrameaPermissionsService;
use App\abstract\interfaces\services\IFrameaWsService;
use App\abstract\interfaces\services\IProductService;
use App\abstract\interfaces\services\IUserService;
use App\Models\Product;
use App\Models\User;
use App\repository\GenericRepository;
use App\Services\Framea\FrameaPermissionseSrvice;
use App\Services\Framea\FrameaPermissionsService;
use App\Services\Framea\FrameaWsService;
use App\Services\ProductService;
use App\Services\UserService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->when(UserService::class)->needs(IGenericRepository::class)
            ->give(fn() => new GenericRepository(User::class));

        $this->app->bind(IUserService::class, UserService::class);

        $this->app->when(ProductService::class)->needs(IGenericRepository::class)
            ->give(fn () => new GenericRepository(Product::class));
        $this->app->bind(IProductService::class, ProductService::class);

        $this->app->singleton(FrameaWsService::class, fn () => new FrameaWsService(
            host: (string) config('services.framea.ws_host', '0.0.0.0'),
            port: (int) config('services.framea.ws_port', 1370),
            path: (string) config('services.framea.ws_path', '/ws'),
            requestTimeout: (float) config('services.framea.ws_request_timeout', 5.0),
        ));

        $this->app->singleton(IFrameaWsService::class, fn () => $this->app->make(FrameaWsService::class));

        $this->app->singleton(IFrameaPermissionsService::class, FrameaPermissionsService::class);


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {


    }
}

<?php

namespace App\Providers;

use App\abstract\interfaces\services\IProductService;
use App\abstract\interfaces\services\IUserService;
use App\Models\Product;
use App\Models\User;
use App\repository\GenericRepository;
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


        $this->app->singleton(UserService::class, function ($app) {
            return new UserService(
                repository: new GenericRepository(User::class)
            );
        });

        $this->app->bind(IUserService::class, UserService::class);

        $this->app->singleton(ProductService::class, function ($app) {
            return new ProductService(
                repository: new GenericRepository(Product::class)
            );
        });


        $this->app->bind(IProductService::class, ProductService::class);

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {


    }
}

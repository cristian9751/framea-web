<?php

use App\Http\Controllers\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Configuration\Middleware;

return function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*');
    $middleware->web(append: [
        HandleInertiaRequests::class,
    ]);
    $middleware->redirectUsersTo('/dashboard');
    $middleware->redirectGuestsTo('/login');
};

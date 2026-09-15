<?php
use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: require __DIR__.'/routing.php',
    )
    ->withMiddleware(
        require __DIR__.'/middleware.php'
    )
    ->withExceptions(
        require __DIR__.'/exceptions.php'
    )->create();

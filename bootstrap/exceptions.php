<?php


use App\Exceptions\AlreadyExists;
use App\Exceptions\CustomException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use \Symfony\Component\HttpKernel\Exception\HttpException;
return function (Exceptions $exceptions): void {
    $exceptions->shouldRenderJsonWhen(
        fn(Request $request) => $request->is('api/*') || $request->expectsJson(),
    );

    $exceptions->render(function (CustomException $e) {
        return back()->withErrors([
            'message' => $e->getMessage(),
            'type' => strtolower(explode("::", get_class($e))[0])
        ]);
    });

    $exceptions->render(function (MethodNotAllowedHttpException $e) {
        if($e->getHeaders()['Allow'] !== 'GET') {
            throw new NotFoundHttpException();
        }
    });
};

<?php

namespace App\abstract;

use App\abstract\interfaces\services\IUserService;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

abstract class  OAuthAuthenticationProvider
{


    public function __construct(
        protected readonly IUserService $userService
    )
    {
    }

    public abstract   function signOut();


    public abstract   function isLinked() : bool;
    public abstract   function authenticate( ) : User;
    public abstract  function redirect() : RedirectResponse;
}

<?php

namespace App\Services\Authentication;

use App\abstract\interfaces\services\IAuthenticationService;
use App\abstract\interfaces\services\IUserService;
use App\Enum\AuthenticatorProvider;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;


class AuthenticationService implements IAuthenticationService
{

    private array $providers;

    /**
     * @param array $providers
     */
    public function __construct(
        array                         $providers,
        private readonly IUserService $userService,
    )
    {
        $this->providers = $providers;
    }


    public function authenticateWithOauth(string $provider) : User{
        $provider = $this->getProviderByName($provider);
        return $this->providers[$provider->name]->authenticate();
    }




    public function redirect(string $provider) : RedirectResponse {
        $provider = $this->getProviderByName($provider);
        return $this->providers[$provider->name]->redirect();
    }

    public function signOut(string $provider): void
    {
        $provider = $this->getProviderByName($provider);
        $this->providers[$provider->name]->signOut();
        if(!$this->checkAccountHasLinkedOauth()) {
            $this->userService->delete(Auth::id());
        }
    }




    public function checkAccountHasLinkedOauth() : bool  {
        return collect(AuthenticatorProvider::cases())->map(function ($provider) {
            return $this->providers[$provider->name]->isLinked();
        })->contains(true);
    }


    /**
     * @throws Exception
     */
    private   function getProviderByName(string $name) : AuthenticatorProvider {
        return AuthenticatorProvider::tryFromName($name) ?? throw new Exception(
            "Invalid authenticator provider: '$name'"
        );
    }

}

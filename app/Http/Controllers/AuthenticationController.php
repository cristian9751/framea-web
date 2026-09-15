<?php

namespace App\Http\Controllers;


use App\abstract\interfaces\services\IAuthenticationService;
use App\dto\DiscordData;
use App\Enum\AuthenticatorProvider;
use App\Services\Authentication\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthenticationController extends Controller
{


    public function __construct(
        private readonly IAuthenticationService $authentication
    )
    {
    }


    public function renderLogin(Request $request)
    {
        if(Auth::check()) {
            return redirect('/dashboard');
        }
        return Inertia::render('Login', [
            'error' => $request->query('error'),
            'steamLoginUrl' => route('auth.login', ['authenticator' => 'steam']),
            'discordLoginUrl' => route('auth.login', ['authenticator' => 'discord']),
        ]);
    }

    public function logout() {
        if(Auth::check()) {
            Auth::logout();
            return redirect('/login');
        }
    }



    public function redirectToAuthenticator(string $provider) {
         return  $this->authentication->redirect($provider);
    }

    public function signInWithAuthenticator(string $provider, Request $request )
    {
        if($request->has('error')) {
            return redirect('login')->with('error', $provider);
        }
        $this->authentication->authenticateWithOauth($provider);

        return redirect('dashboard');


    }

    public function signOutWithAuthenticator(string $provider) {
        $this->authentication->signOut($provider);
    }
}

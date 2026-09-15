<?php

namespace App\Services\Authentication;

use App\abstract\OAuthAuthenticationProvider;
use App\dto\UserRegistration;
use App\Exceptions\CustomException;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

class SteamAuthenticationProvider extends  OAuthAuthenticationProvider
{

    /**
     * @throws CustomException
     */
    public function authenticate(): User
    {
        try {
            $steamUser = Socialite::driver('steam')->user();
        } catch(InvalidStateException $e) {
            throw new CustomException($e->getMessage());
        }
        if(Auth::check()){
            $user   = Auth::user();
            $user->update([
                'steam_id' => $steamUser->getId(),
                'steam_nickname' => $steamUser->getNickname(),
                'steam_avatar_url' => $steamUser->getAvatar(),
            ]);
            $user->refresh();
        } else {

            $userRegistration = new UserRegistration(
                provider: "steam",
                providerId: $steamUser->getId(),
            );
            $user = $this->userService->save($userRegistration);

            $user->update([
                'steam_nickname' => $steamUser->getNickname(),
                'steam_avatar_url' => $steamUser->getAvatar(),
            ]);
            $user->refresh();

            Auth::login($user);
        }


        return $user;
    }

    public function redirect(): RedirectResponse
    {
        return Socialite::driver('steam')->redirect();
    }

    public function signOut()
    {
        if(Auth::check()){
            $user = Auth::user();
            $user->update([
                'steam_id' => null,
                'steam_nickname' => null,
                'steam_avatar_url' => null,
            ]);
            $user->refresh();
        }
    }

    public function isLinked(): bool
    {
        if(Auth::check()){
            return Auth::user()->steam_id !== null;
        }
        return false;
    }
}

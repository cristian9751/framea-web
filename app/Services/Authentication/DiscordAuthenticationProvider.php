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

class DiscordAuthenticationProvider extends   OAuthAuthenticationProvider
{


    public function redirect(): RedirectResponse
    {
        return Socialite::driver('discord')->redirect();
    }

    /**
     * @throws CustomException
     */
    public function authenticate(): User
    {
        try {
            $discordUser = Socialite::driver('discord')->user();
        } catch(InvalidStateException $e) {
            throw new CustomException($e->getMessage());
        }


        if(Auth::check()){
            $user   = Auth::user();
            $user->update([
                'discord_id' => $discordUser->getId(),
                'discord_username' => $discordUser->getName(),
                'discord_avatar_url' => $discordUser->getAvatar(),
                'email'     => $discordUser->getEmail(),
            ]);
            $user->refresh();
        } else {
            $userRegistration = new UserRegistration(
                provider: "discord",
                providerId: $discordUser->getId(),
                email: $discordUser->getEmail(),
            );
            $user = $this->userService->save($userRegistration);

            $user->update([
                'discord_username' => $discordUser->getName(),
                'discord_avatar_url' => $discordUser->getAvatar(),
            ]);
            $user->refresh();

            Auth::login($user);
        }



        return $user;
    }

    public function signOut()
    {
        if(Auth::check()){
            $user = Auth::user();
            $user->update([
                'discord_id' => null,
                'discord_username' => null,
                'discord_avatar_url' => null,
                'email'     => null,
            ]);

            $user->refresh();
        }
    }

    public function isLinked(): bool
    {
        if(Auth::check()){
            return Auth::user()->discord_id !== null;
        }
        return false;
    }
}

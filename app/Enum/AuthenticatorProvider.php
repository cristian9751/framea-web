<?php

namespace App\Enum;

use App\Services\Authentication\DiscordAuthenticationProvider;
use App\Services\Authentication\SteamAuthenticationProvider;

enum AuthenticatorProvider : string
{

    case discord = DiscordAuthenticationProvider::class;

    case steam = SteamAuthenticationProvider::class;
    public static function tryFromName(string $name): ?self
    {
        foreach (self::cases() as $case) {
            if ($case->name === $name) {
                return $case;
            }
        }

        return null;
    }
}

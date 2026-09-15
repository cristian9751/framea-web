<?php

namespace App\abstract\interfaces\services;

use App\Models\User;
use Illuminate\Http\RedirectResponse;

interface IAuthenticationService
{
    public function authenticateWithOauth(string $provider): User;

    public function redirect(string $provider): RedirectResponse;

    public function signOut(string $provider): void;

    public function checkAccountHasLinkedOauth(): bool;
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashBoardController extends Controller
{
    public function index()
    {
        $user = Auth::user();


        $steamData = $user->steam_id !== null  ? [
            'username' => $user->steam_nickname,
            'id' => $user->steam_id,
            'avatar_url' => $user->steam_avatar_url,
            'linked' => true
        ] : [
            'linked' => false
        ];
        $discordData = $user->discord_id !== null ?
            [
                'username' => $user->discord_username,
                'id' => $user->discord_id,
                'avatar_url' => $user->discord_avatar_url,
                'linked' => true
            ] :
            [
                'linked' => false
            ];
        return Inertia::render('Dashboard', [
            'steamData' => $steamData,
            'discordData' => $discordData,
        ]);
    }
}

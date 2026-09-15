<?php

use App\Http\Controllers\AuthenticationController;

Route::get('/signin/{authenticator}', [AuthenticationController::class, 'redirectToAuthenticator'])->name('auth.login');
Route::post('/signout/{authenticator}', [AuthenticationController::class, 'signOutWithAuthenticator'])->name('auth.signout');
Route::get('/callback/{authenticator}', [AuthenticationController::class, 'signInWithAuthenticator']);
Route::post('/logout', [AuthenticationController::class, 'logout'])->name('auth.logout');

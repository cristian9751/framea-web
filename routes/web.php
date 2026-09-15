<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;


Route::inertia('/', 'Home')->name('home');
Route::inertia('/rules', 'Rules')->name('rules');
Route::inertia('/about', 'About')->name('about');
Route::get('/login', [AuthenticationController::class, 'renderLogin'])->name('login');


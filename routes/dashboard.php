<?php

use App\Http\Controllers\DashBoardController;

Route::get('/', [DashBoardController::class, 'index'])->name('dashboard');


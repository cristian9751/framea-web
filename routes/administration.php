<?php

use App\Http\Controllers\FrameaPermissionsController;

Route::inertia('/dashboard', 'AdminDashboard');

Route::prefix('dashboard/perms')->name('perms.')->group(function () {
    Route::get('/', [FrameaPermissionsController::class, 'index'])->name('index');
    Route::get('/user/{steamId}', [FrameaPermissionsController::class, 'show'])->name('user');
    Route::get('/group/{groupName}', [FrameaPermissionsController::class, 'groupInfo'])->name('group');
    Route::get('/check', [FrameaPermissionsController::class, 'check'])->name('check');

    Route::post('/grant', [FrameaPermissionsController::class, 'grant'])->name('grant');
    Route::post('/revoke', [FrameaPermissionsController::class, 'revoke'])->name('revoke');

    Route::post('/', [FrameaPermissionsController::class, 'groupCreate'])->name('group.store');
    Route::delete('/group/{groupName}', [FrameaPermissionsController::class, 'groupDelete'])->name('group.delete');

    Route::post('/track/{track}/promote', [FrameaPermissionsController::class, 'trackPromote'])->name('track.promote');
    Route::post('/track/{track}/demote', [FrameaPermissionsController::class, 'trackDemote'])->name('track.demote');
});
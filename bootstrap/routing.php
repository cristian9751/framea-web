<?php
return function() {
    Route::middleware(['auth', 'web'])->prefix('dashboard')->name('dashboard.')->group(
        base_path('routes/dashboard.php')
    );

    Route::prefix('auth')->middleware('web')->group(
        base_path('routes/authentication.php')
    );

    Route::prefix('product')->name('product.')->group(
        base_path('routes/product.php')
    );

    Route::prefix('admin')->name('admin.')->group(
        base_path('routes/administration.php')
    );
};

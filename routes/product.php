<?php

use App\Http\Controllers\ProductController;

Route::post('/store', [ProductController::class, 'store'])->name('store');

Route::get('/',  [ProductController::class, 'index'])->name('product.index');

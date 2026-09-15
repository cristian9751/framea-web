<?php

use App\Enum\Actions;
use App\Models\User;
use Database\Factories\CreateProductFactory;



test('can create product', function () {
    $user = User::factory()->create([
        'role_id' => 2
    ]);
    $newProduct = CreateProductFactory::make();
    expect(Gate::forUser($user)->allows(Actions::CreateProduct))->toBeTrue();
    $this->actingAs($user);
    $this->postJson(route('product.store'),$newProduct);
    $this->assertDatabaseHas('products', ['slug' => $newProduct['slug']]);

});
test('has no permission to create product', function () {
    $newProduct = CreateProductFactory::make();
    $user = User::factory()->create();
    expect(Gate::forUser($user)->allows(Actions::CreateProduct))->toBeFalse();
    $this->actingAs($user);
    $this->postJson(route('product.store'), $newProduct);
    $this->assertDatabaseMissing('products', ['slug' => $newProduct['slug']]);
});



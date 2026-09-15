<?php

namespace Tests;

use Database\Seeders\BillingTypeSeeder;
use Database\Seeders\ProductCategorySeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use DatabaseTransactions;

    protected function setUp(): void {
        parent::setUp();
        $this->artisan('migrate', ['--database' => 'testing']);
        $this->seed();
        $this->seed(BillingTypeSeeder::class);
        $this->seed(ProductCategorySeeder::class);
    }
}

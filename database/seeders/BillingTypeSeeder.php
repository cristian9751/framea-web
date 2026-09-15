<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BillingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('billing_types')->insert([
            'name' => 'single',
            'billing_interval_days' => null,
            'is_active' => true

        ]);

        DB::table('billing_types')->insert([
            'name' => 'monthly',
            'billing_interval_days' => 30,
            'is_active' => true
        ]);
        DB::table('billing_types')->insert([
            'name' => 'yearly',
            'billing_interval_days' => 365,
            'is_active' => true
        ]);
    }
}

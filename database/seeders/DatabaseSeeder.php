<?php

namespace Database\Seeders;

use App\Enum\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            'name' => 'user',
            'display_name' => 'User',
            'description' => 'Role that has no permissions ',
            'id' => 1
        ]);
        DB::table('roles')->insert([
            'name' => 'admin',
            'display_name' => 'Administrator',
            'description' => 'Role that has all the permissions ',
            'id' => 2
        ]);
        foreach(Permission::cases() as $permission) {
            DB::table("permissions")->insert([
                "name" => $permission->name,
                "id" => $permission->value
            ]);
            DB::table('permission_role')->insert([
                "permission_id" => $permission->value,
                "role_id" => 2
            ]);
        }



    }
}

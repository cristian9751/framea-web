<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('steam_nickname')->nullable();
            $table->string('steam_avatar_url')->nullable();
            $table->string('discord_username')->nullable();
            $table->string('discord_avatar_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['steam_nickname', 'steam_avatar_url', 'discord_username', 'discord_avatar_url']);
        });
    }
};

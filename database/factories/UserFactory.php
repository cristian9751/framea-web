<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->numberBetween(1, 1000),
            'discord_id' => fake()->unique()->uuid(),
            'email' => fake()->unique()->safeEmail(),
            'discord_username' => fake()->unique()->username(),
            'discord_avatar_url' => fake()->url(),
            'steam_id' => fake()->unique()->uuid(),
            'steam_nickname' => fake()->unique()->username(),
            'steam_avatar_url' => fake()->url(),
            'role_id' => 1
        ];
    }

    public function administrator(): Factory {
        return $this->state(function () {
            return [
                'role_id' => 2,
            ];
        });

    }

    public function suspended(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'is_suspended' => !$attributes['is_suspended'],
            ];
        });
    }
}

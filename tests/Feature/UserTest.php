<?php
use App\Models\User;
use Tests\TestCase;
use function Pest\Laravel\assertAuthenticated;
use Laravel\Socialite\Contracts\User as SocialiteUser;

test('user   gets redirected to discord authentication page', function () {
    $this->get('/auth/signin/discord')->assertStatus(302);

});

test('user gets redirected to steam authentication page', function () {
    $this->get('/auth/signin/steam')->assertStatus(302);
});
test('user gets redirected to log in when accessing dashboard if its not authenticated', function () {
    $this->get('/dashboard')->assertRedirect('/login');

});

test('user can access user dashboard when authenticated', function () {
    $this->actingAs(User::factory()->create());
    $this->get('/dashboard')->assertOk();
});
test('user gets redirected to user  dashboard if accesing login when authenticated', function () {
    $this->actingAs(User::factory()->create());
    $this->get('/login')->assertRedirect('/dashboard');
});

/**
 * @param TestCase $testCase
 * @return void
 */


describe('discord tests', function () {

    beforeEach(function () {
        $this->user = User::factory()->make();
        $this->socialiteUser = Mockery::mock(SocialiteUser::class);


        $this->socialiteUser
            ->shouldReceive('getId')
            ->andReturn($this->user->discord_id);

        $this->socialiteUser
            ->shouldReceive('getNickname')
            ->andReturn($this->user->discord_username);

        $this->socialiteUser
            ->shouldReceive('getName')
            ->andReturn($this->user->discord_username);

        $this->socialiteUser
            ->shouldReceive('getEmail')
            ->andReturn($this->user->email);

        $this->socialiteUser
            ->shouldReceive('getAvatar')
            ->andReturn($this->user->discord_avatar_url);

        Socialite::fake('discord', $this->socialiteUser);
    });
    it('can login with discord', function () {
        $this->user->save();
        $this->get('/auth/callback/discord');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['discord_id' => $this->socialiteUser->getId()]);
    });

    it('can register with discord', function () {
        User::truncate();
       $this->assertDatabaseMissing('users', ['discord_id' => $this->socialiteUser->getId()]);
       $this->get("/auth/callback/discord");
       $this->assertAuthenticated();
       $this->assertDatabaseHas('users', ['discord_id' => $this->socialiteUser->getId()]);
    });

});

describe('steam tests', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->socialiteUser = Mockery::mock(SocialiteUser::class);

        $this->socialiteUser
            ->shouldReceive('getId')
            ->andReturn($this->user->steam_id);

        $this->socialiteUser
            ->shouldReceive('getNickname')
            ->andReturn($this->user->steam_username);

        $this->socialiteUser
            ->shouldReceive('getName')
            ->andReturn($this->user->steam_username);

        $this->socialiteUser
            ->shouldReceive('getAvatar')
            ->andReturn($this->user->steam_avatar_url);

        Socialite::fake('steam', $this->socialiteUser);

    });

    it('can log in with steam ' , function () {
        $this->user->save();
        $this->get("/auth/callback/steam");
        assertAuthenticated();
        $this->assertDatabaseHas('users', ['steam_id' => $this->socialiteUser->getId()]);
    });
    it('can register with steam ' , function () {
        User::truncate();
        $this->assertDatabaseMissing('users', ['steam_id' => $this->socialiteUser->getId()]);
        $this->get("/auth/callback/steam");
        assertAuthenticated();
        $this->assertDatabaseHas('users', ['steam_id' => $this->socialiteUser->getId()]);
    });
});

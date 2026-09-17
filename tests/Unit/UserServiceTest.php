<?php


use App\abstract\interfaces\IGenericRepository;
use App\dto\UserRegistration;
use App\repository\GenericRepository;
use App\Services\UserService;
use function Pest\Laravel\instance;



test('first user gets administrator role', function () {
    $userService = app()->make(UserService::class);
    $spyRepository = Mockery::spy(GenericRepository::class);
    app()->instance(IGenericRepository::class, $spyRepository);
    $mockUserRegistration = Mockery::mock(UserRegistration::class)
        ->makePartial();
    $mockUserRegistration
        ->shouldReceive('getProviderId')
        ->andReturn(fake()->uuid());
    $mockUserRegistration
        ->shouldReceive('getProvider')
        ->andReturn('discord');
    $mockUserRegistration
        ->shouldReceive('getEmail')
        ->andReturn(fake()->email())
        ->getMock();
    $userService->save($mockUserRegistration);

    $spyRepository->shouldHaveReceived('create')->once();

});

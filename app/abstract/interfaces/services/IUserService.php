<?php

namespace App\abstract\interfaces\services;



use App\dto\AbstractDTO;
use App\dto\UserRegistration;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of User
 * @template TDTO of UserRegistration
 */
interface IUserService extends IService
{
    /**
     * @param UserRegistration $dto
     * @return User
     */
    public function save(UserRegistration|AbstractDTO $dto): User;

    public function delete(int $id): bool;

    /**
     * @return User
     */
    public function getById(int $id): User;
}

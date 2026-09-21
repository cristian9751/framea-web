<?php

namespace App\Services;

use App\abstract\interfaces\IGenericRepository;
use App\abstract\interfaces\services\IUserService;
use App\dto\AbstractDTO;
use App\dto\UserRegistration;
use App\Exceptions\NotExists;
use App\Models\User;
use App\repository\GenericRepository;

/**
 * @implements IUserService<User, UserRegistration>
 */
class UserService  implements IUserService
{

    private IGenericRepository $repository;

    public function __construct(
        IGenericRepository $repository,
    )
    {
        $this->repository = $repository;
    }

    public function save(AbstractDTO | UserRegistration $dto) : User {
        assert($dto instanceof  UserRegistration);
        $newUserData = $dto->toArray();

        $newUserData['role_id'] = User::all()->count() >= 1 ? 1 : 2;
        return $this->repository->create($newUserData, [
            $dto->getProvider() . "_id" => $dto->getProviderId(),
        ]);

    }
    public function delete(int  $userId) : bool {
        return $this->repository->delete($userId);
    }


    /**
     * @throws NotExists
     */
    public function getById(int $id) : User {
        $user =  $this->repository->getById($id);

        if($user == null) {
            throw new NotExists(
                modelName: "User",
                valueName: "id",
                value: $id,
            );
        }

        assert($user instanceof User);
        return $user;
    }

    public function getAll(): array
    {
        return $this->repository->getAll();
    }
}

<?php

namespace App\repository;

use App\abstract\interfaces\IGenericRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\UniqueConstraintViolationException;

 class GenericRepository implements IGenericRepository
{


    private string $modelClassName;

    /**
     * @param string $modelClassName
     */
    public function __construct(string $modelClassName)
    {
        $this->modelClassName = $modelClassName;
    }


    public  function create(array $data, array $idAttributes = null, callable $alreadyExists = null)  : Model{
        try {
            if($idAttributes == null) {
                return $this->modelClassName::create($data);
            } else {
                return $this->modelClassName::updateOrCreate($idAttributes, $data);
            }
        } catch (UniqueConstraintViolationException $e) {
           if($alreadyExists == null) {
               throw $e;
           } else {
               return $alreadyExists($e, $data);
           }
        }


    }

    public  function delete(int $id) : bool {
        return $this->modelClassName::where("id", $id)->delete();
    }

     public function getById(int  $id ) : Model | null {
        return $this->modelClassName::where("id", $id)->first();
    }


    public function getAll() : array {
        return $this->modelClassName::all()->toArray();
    }
}

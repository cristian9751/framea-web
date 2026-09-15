<?php

namespace App\dto;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserRegistration extends AbstractDTO
{
    private string $email;

    private string $provider;
    private string $providerId;


    /**
     * @param string $email
     * @param string $provider
     * @param string $providerId
     */
    public function __construct(
        string $email = "",
        string $provider = "",
        string $providerId = "",

    )
    {
        $this->email = $email;
        $this->provider = $provider;
        $this->providerId = $providerId;
    }



    public function getEmail(): string
    {
        return $this->email;
    }


    public function getProvider(): string {
        return $this->provider;
    }

    public function getProviderId(): string
    {
        return $this->providerId;
    }





    public   function toArray() : array
    {
        return [
            "email" => $this->getEmail() ?? "",
        ];
    }


    /**
     * @throws \Exception
     */
    public  static  function fromArray(array $array) : self
    {
        throw new \Exception("Not implemented");
    }
}

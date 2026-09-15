<?php

namespace App\Exceptions;

class NotExists extends CustomException
{


    public string  $modelName;
    public string  $valueName;
    public string  $value;

    public function __construct(
         string $modelName,
         string $valueName,
         string $value
    )
    {
        parent::__construct("The {$modelName} with the {$valueName} and {$value} does not exist.");
    }
}

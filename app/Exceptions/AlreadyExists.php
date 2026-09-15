<?php

namespace App\Exceptions;
use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;

class AlreadyExists extends CustomException
{
    public function __construct(string $value , string $parameterName, string $parameterValue) {
        parent::__construct("$value with $parameterName: $parameterValue already exists.");


    }



}

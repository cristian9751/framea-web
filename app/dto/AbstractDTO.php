<?php

namespace App\dto;

 abstract class  AbstractDTO
{

    public static  abstract function fromArray(array $array) : self;

    public abstract  function toArray() : array;

}

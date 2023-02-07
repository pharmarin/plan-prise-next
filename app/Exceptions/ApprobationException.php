<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class ApprobationException extends AuthorizationException
{
  /**
   * @inheritDoc
   */
  function __construct(
    $message = null,
    $code = null,
    ?Throwable $previous = null
  ) {
    parent::__construct(
      "Votre inscription n'a pas encore été vérifiée. Vous recevrez un mail dès que votre compte sera activé. ",
      $code,
      $previous
    );
  }
}

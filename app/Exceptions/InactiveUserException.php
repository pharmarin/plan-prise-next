<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Response;

abstract class InactiveUserException extends Exception
{
    public function render(Request $request): Response
    {
        $status = 403;
        $error = "Utilisateur inactif";
        $help = "Merci d'attendre que l'équipe active votre compte. ";

        return response(["error" => $error, "help" => $help], $status);
    }
}

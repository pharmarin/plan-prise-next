<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Exceptions\InactiveUserException;
use Illuminate\Auth\AuthenticationException;

class OldUser extends Model
{
  use HasFactory;

  protected $table = "users_old";

  protected $primaryKey = "Id";

  const CREATED_AT = "inscription";

  static function authenticate(string $ulogin, string $upassword)
  {
    $user = OldUser::firstWhere("mail", $ulogin);

    if ($user->active === 0) {
      throw new InactiveUserException();
    }

    if (password_verify($upassword, $user->password)) {
      return $user;
    }

    throw new AuthenticationException();
  }
}

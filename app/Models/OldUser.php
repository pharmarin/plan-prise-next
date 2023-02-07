<?php

namespace App\Models;

use App\Exceptions\ApprobationException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    if ($user->active !== 1) {
      throw new ApprobationException();
    }

    if (password_verify($upassword, $user->password)) {
      return $user;
    }

    throw new AuthenticationException();
  }
}

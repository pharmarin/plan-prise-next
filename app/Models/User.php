<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    "email",
    "password",
    "first_name",
    "last_name",
    "display_name",
    "student",
    "rpps",
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = ["password", "remember_token"];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    "active_at" => "datetime",
  ];

  static function fromOldUser(OldUser $old_user, string $password)
  {
    $user = User::create([
      "email" => $old_user->mail,
      "password" => Hash::make($password),
      "display_name" => $old_user->fullname,
      "student" => $old_user->status === 2,
      "rpps" => $old_user->rpps,
    ]);

    $user->admin = $old_user->admin;
    $user->active_at = $old_user->inscription;
    $user->created_at = $old_user->inscription;

    $user->save();

    return $user;
  }
}

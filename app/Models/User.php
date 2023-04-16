<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
  use HasFactory, Notifiable;

  //private OldUser $old_user;

  const CREATED_AT = "createdAt";
  const UPDATED_AT = "updatedAt";

  public $incrementing = false;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    "email",
    "password",
    "firstName",
    "lastName",
    "displayName",
    "student",
    "rpps",
    "approvedAt",
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
    "approvedAt" => "datetime",
    "admin" => "boolean",
    "student" => "boolean",
  ];

  protected function name(): Attribute
  {
    return Attribute::make(
      fn () => $this->firstName && $this->lastName
        ? $this->firstName . " " . $this->lastName
        : ""
    );
  }

  protected function active(): Attribute
  {
    return Attribute::make(fn () => $this->approvedAt !== null);
  }

  /* public function old_user()
  {
    return $this->hasOne(OldUser::class, "mail", "email");
  } */

  /* static function fromOldUser(OldUser $old_user, string $password)
  {
    $user = User::create([
      "email" => $old_user->mail,
      "password" => Hash::make($password),
      "displayName" => $old_user->fullname,
      "student" => $old_user->status === 2,
      "rpps" => $old_user->rpps,
    ]);

    $user->admin = $old_user->admin;
    $user->approvedAt = $old_user->inscription;
    $user->createdAt = $old_user->inscription;

    $user->save();

    // TODO: Later we will delete OldUser, but for now we need it for legacy

    return $user;
  } */
}

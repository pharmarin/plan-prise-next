<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  private OldUser $old_user;

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
    "approved_at",
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
    "approved_at" => "datetime",
    "admin" => "boolean",
    "student" => "boolean",
  ];

  protected function name(): Attribute
  {
    return Attribute::make(
      fn() => $this->first_name && $this->last_name
        ? $this->first_name . " " . $this->last_name
        : ""
    );
  }

  protected function active(): Attribute
  {
    return Attribute::make(fn() => $this->approved_at !== null);
  }

  public function old_user()
  {
    return $this->hasOne(OldUser::class, "mail", "email");
  }

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
    $user->approved_at = $old_user->inscription;
    $user->created_at = $old_user->inscription;

    $user->save();

    // TODO: Later we will delete OldUser, but for now we need it for legacy

    return $user;
  }
}

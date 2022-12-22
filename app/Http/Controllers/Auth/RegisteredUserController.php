<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
  /**
   * Handle an incoming registration request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function store(Request $request)
  {
    $request->validate([
      "email" => [
        "required",
        "string",
        "email",
        "max:255",
        "unique:" . User::class,
      ],
      "password" => ["required", "confirmed", Rules\Password::defaults()],
      "first_name" => ["required", "string", "max:255"],
      "last_name" => ["required", "string", "max:255"],
      "student" => ["boolean"],
      "rpps" => ["numeric", "digits:11"],
    ]);

    $user = User::create([
      "email" => $request->email,
      "password" => Hash::make($request->password),
      "first_name" => $request->firstName,
      "last_name" => $request->lastName,
      "student" => $request->student,
      "rpps" => $request->rpps,
    ]);

    event(new Registered($user));

    Auth::login($user);

    return response()->noContent();
  }
}

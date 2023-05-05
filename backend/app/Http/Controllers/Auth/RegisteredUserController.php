<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\Registered as MailRegistered;
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
      "recaptcha" => ["required", "captcha"],
      "email" => [
        "required",
        "string",
        "email",
        "max:255",
        "unique:" . User::class . ",email",
      ],
      "password" => ["required", "confirmed", Rules\Password::defaults()],
      "firstName" => ["required", "string", "max:255"],
      "lastName" => ["required", "string", "max:255"],
      "displayName" => ["string", "min:3", "max:50"],
      "student" => ["boolean"],
      "rpps" => ["required_if:student,false", "numeric", "digits:11"],
      "certificate" => [
        "required_if:student,true",
        "file",
        "mimes:png,jpg,jpeg,pdf",
      ],
    ]);

    $user = User::create([
      "email" => $request->email,
      "password" => Hash::make($request->password),
      "firstName" => $request->firstName,
      "lastName" => $request->lastName,
      "student" => $request->student,
      "rpps" => $request->rpps,
    ]);

    event(new Registered($user));

    return response()->noContent();
  }
}

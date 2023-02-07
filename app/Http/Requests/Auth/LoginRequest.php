<?php

namespace App\Http\Requests\Auth;

use App\Exceptions\ApprobationException;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\OldUser;
use App\Models\User;
use Barryvdh\Debugbar\Facades\Debugbar;

class LoginRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */
  public function authorize()
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array
   */
  public function rules()
  {
    return [
      "email" => ["required", "string", "email"],
      "password" => ["required", "string"],
    ];
  }

  /**
   * Attempt to authenticate the request's credentials.
   *
   * @return void
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function authenticate()
  {
    $this->ensureIsNotRateLimited();

    if (
      !Auth::attemptWhen(
        $this->only("email", "password"),
        function (User $user) {
          if (!$user->approved_at) {
            throw new ApprobationException();

            return false;
          }

          return true;
        },
        $this->boolean("remember")
      )
    ) {
      try {
        $old_user = OldUser::authenticate(
          $this->input("email"),
          $this->input("password")
        );

        $user = User::fromOldUser($old_user, $this->input("password"));

        Auth::login($user);
      } catch (\Throwable $th) {
        Debugbar::log($th);

        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
          "email" => __("auth.failed"),
        ]);
      }
    }

    RateLimiter::clear($this->throttleKey());
  }

  /**
   * Ensure the login request is not rate limited.
   *
   * @return void
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function ensureIsNotRateLimited()
  {
    if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
      return;
    }

    event(new Lockout($this));

    $seconds = RateLimiter::availableIn($this->throttleKey());

    throw ValidationException::withMessages([
      "email" => trans("auth.throttle", [
        "seconds" => $seconds,
        "minutes" => ceil($seconds / 60),
      ]),
    ]);
  }

  /**
   * Get the rate limiting throttle key for the request.
   *
   * @return string
   */
  public function throttleKey()
  {
    return Str::transliterate(
      Str::lower($this->input("email")) . "|" . $this->ip()
    );
  }
}

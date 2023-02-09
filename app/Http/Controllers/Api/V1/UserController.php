<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\UserApproved;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\JsonApi\V1\Users\UserQuery;
use App\JsonApi\V1\Users\UserSchema;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use LaravelJsonApi\Contracts\Routing\Route;
use LaravelJsonApi\Contracts\Store\Store;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class UserController extends Controller
{
  use Actions\FetchMany;
  use Actions\FetchOne;
  use Actions\Store;
  use Actions\Update;
  use Actions\Destroy;
  use Actions\FetchRelated;
  use Actions\FetchRelationship;
  use Actions\UpdateRelationship;
  use Actions\AttachRelationship;
  use Actions\DetachRelationship;

  public function current(Route $route, Store $store)
  {
    $request = ResourceQuery::queryOne($resourceType = $route->resourceType());

    $model = $store
      ->queryOne($resourceType, (string) Auth::id())
      ->withRequest($request)
      ->first();

    return DataResponse::make($model)->withQueryParameters($request);
  }

  /**
   * @return \Illuminate\Http\Response
   * @throws \Illuminate\Auth\Access\AuthorizationException
   */
  public function updatePassword(Request $request): \Illuminate\Http\Response
  {
    $request->validate([
      "data.attributes.current_password" => ["required", "current_password"],
      "data.attributes.password" => ["required", "confirmed", "min:8"],
    ]);

    User::findOrFail(Auth::id())->update([
      "password" => Hash::make($request->input("data.attributes.password")),
    ]);

    return response("", 204);
  }

  /**
   * Handle an approbation incoming request.
   *
   * @param UserQuery $query
   * @param User $user
   * @return \Illuminate\Http\Response
   */
  public function approve(
    UserQuery $query,
    User $user
  ): \Illuminate\Http\Response {
    $this->authorize("approve", $user);

    $query->validate([
      "data.id" => ["required", "numeric"],
      "data.type" => ["required", "in:users"],
      "data.attributes.approvedAt" => [
        "date",
        "nullable",
        Rule::prohibitedIf(!Auth::user()->admin),
      ],
    ]);

    $user = User::findOrFail($query->input("data.id"));

    $user->update([
      "approved_at" => Carbon::parse(
        $query->input("data.attributes.approvedAt")
      ),
    ]);

    UserApproved::dispatch($user);

    return response("", 204);
  }

  /**
   * Handle an incoming registration request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function register(Request $request)
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
      "display_name" => ["string", "min:3", "max:50"],
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
      "first_name" => $request->firstName,
      "last_name" => $request->lastName,
      "student" => $request->student,
      "rpps" => $request->rpps,
    ]);

    event(new Registered($user));

    return response()->noContent();
  }

  /**
   * Handle an incoming authentication request.
   *
   * @param  \App\Http\Requests\Auth\LoginRequest  $request
   * @return \Illuminate\Http\Response
   */
  public function login(LoginRequest $request)
  {
    $request->authenticate();

    $request->session()->regenerate();

    return response()->noContent();
  }

  /**
   * Destroy an authenticated session.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function logout(Request $request)
  {
    Auth::guard("web")->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return response()->noContent();
  }

  /**
   * Handle an incoming password reset link request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\JsonResponse
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function forgotPassword(Request $request)
  {
    $request->validate([
      "data.attributes.email" => ["required", "email"],
      "data.attributes.recaptcha" => ["required", "captcha"],
    ]);

    // We will send the password reset link to this user. Once we have attempted
    // to send the link, we will examine the response then see the message we
    // need to show to the user. Finally, we'll send out a proper response.
    $status = Password::sendResetLink([
      "email" => $request->input("data.attributes.email"),
    ]);

    /* if ($status != Password::RESET_LINK_SENT) {
      throw ValidationException::withMessages([
        "email" => [__($status)],
      ]);
    } */

    return response("", 204);
  }
}

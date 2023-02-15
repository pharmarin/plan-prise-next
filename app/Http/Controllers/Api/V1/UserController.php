<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\UserApproved;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\JsonApi\V1\Users\UserQuery;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use LaravelJsonApi\Contracts\Routing\Route;
use LaravelJsonApi\Contracts\Store\Store;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

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

    return response()->noContent();
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

    return response()->noContent();
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
    $validationSchema = [
      "data.type" => ["required", "in:users"],
      "data.attributes.recaptcha" => ["required", "captcha"],
      "data.attributes.email" => [
        "required",
        "string",
        "email",
        "max:255",
        "unique:" . User::class . ",email",
      ],
      "data.attributes.password" => [
        "required",
        "confirmed",
        Rules\Password::defaults(),
      ],
      "data.attributes.firstName" => ["required", "string", "max:255"],
      "data.attributes.lastName" => ["required", "string", "max:255"],
      "data.attributes.display_name" => ["string", "min:3", "max:50"],
      "data.attributes.student" => ["boolean"],
    ];

    if ($request->boolean("data.attributes.student")) {
      $validationSchema["data.attributes.certificate"] = [
        "required",
        "file",
        "mimes:png,jpg,jpeg,pdf",
      ];
    } else {
      $validationSchema["data.attributes.rpps"] = [
        "required",
        "numeric",
        "digits:11",
      ];
    }

    $request->validate($validationSchema);

    $user = User::create([
      "email" => $request->input("data.attributes.email"),
      "password" => Hash::make($request->input("data.attributes.password")),
      "first_name" => $request->input("data.attributes.firstName"),
      "last_name" => $request->input("data.attributes.lastName"),
      "student" => $request->boolean("data.attributes.student"),
      "rpps" => $request->integer("data.attributes.rpps"),
    ]);

    if ($certificate = $request->file("data.attributes.certificate")) {
      $certificate->storeAs(
        "certificates",
        $user->id . "." . $certificate->extension()
      );
    }

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

    return response()->noContent();
  }

  public function downloadCertificate(User $user)
  {
    $this->authorize("certificate", User::class);

    return Storage::download("certificates/$user->id");
  }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\UserApproved;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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

  public function approve(Request $request): \Illuminate\Http\Response
  {
    $isAdmin = Auth::user() && Auth::user()->admin;

    if (!$isAdmin) {
      throw new AuthorizationException(
        "Les utilisateurs ne peuvent pas modifier se paramètre. "
      );
    }

    $request->validate([
      "data.id" => ["required", "numeric"],
      "data.type" => ["required", "in:users"],
      "data.attributes.approvedAt" => [
        "date",
        "nullable",
        Rule::prohibitedIf(!$isAdmin),
      ],
    ]);

    $user = User::findOrFail($request->input("data.id"));

    $user->update([
      "approved_at" => Carbon::parse(
        $request->input("data.attributes.approvedAt")
      ),
    ]);

    UserApproved::dispatch($user);

    return response("", 204);
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

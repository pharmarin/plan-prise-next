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
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;
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
}

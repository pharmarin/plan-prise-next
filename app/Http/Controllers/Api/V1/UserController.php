<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;

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
    $validated = $request->validate([
      "data.attributes.current_password" => ["required", "current_password"],
      "data.attributes.password" => ["required", "confirmed", "min:8"],
    ]);

    User::whereId(Auth::id())->update([
      "password" => Hash::make($validated["data"]["attributes"]["password"]),
    ]);

    return response("", 204);
  }
}

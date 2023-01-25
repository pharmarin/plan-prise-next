<?php

use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(["auth:sanctum"])->get("/user", function () {
  return redirect()->route("v1.users.show", ["user" => Auth::id()]);
});

JsonApiRoute::server("v1")
  ->prefix("v1")
  ->resources(function ($server) {
    $server->resource("users", UserController::class);
    $server
      ->resource("users", UserController::class)
      ->actions(function ($actions) {
        $actions->patch("update-password");
      });

    $server->resource("old-users", JsonApiController::class)->readOnly();
  });

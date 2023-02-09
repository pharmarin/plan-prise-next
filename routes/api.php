<?php

use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
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

Route::prefix("v1")->group(function () {
  Route::middleware(["auth:sanctum"])->get("/user", function () {
    return redirect()->route("v1.users.show", ["user" => Auth::id()]);
  });

  Route::post("/register", [RegisteredUserController::class, "store"])
    ->middleware("guest")
    ->name("register");

  Route::post("/login", [AuthenticatedSessionController::class, "store"])
    ->middleware("guest")
    ->name("login");

  Route::post("/logout", [AuthenticatedSessionController::class, "destroy"])
    ->middleware("auth")
    ->name("logout");
});

JsonApiRoute::server("v1")
  ->prefix("v1")
  ->resources(function ($server) {
    $server->resource("users", UserController::class);
    $server
      ->resource("users", UserController::class)
      ->actions(function ($actions) {
        $actions->patch("update-password");
        $actions->withId()->patch("approve");
        $actions->post("forgot-password");
      });

    $server->resource("old-users", JsonApiController::class)->readOnly();
  });

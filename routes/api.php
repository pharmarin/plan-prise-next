<?php

use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\JsonApi\V1\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use LaravelJsonApi\Laravel\Routing\ActionRegistrar;
use LaravelJsonApi\Laravel\Routing\ResourceRegistrar;
use LaravelJsonApi\Laravel\Routing\Route as RoutingRoute;

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

JsonApiRoute::server("v1")
  ->prefix("v1")
  ->resources(function (ResourceRegistrar $server) {
    $server->resource("users", UserController::class);
    $server
      ->resource("users", UserController::class)
      ->actions(function (ActionRegistrar $actions) {
        // Auth
        $actions->get("current");
        $actions->post("register");
        $actions->post("login");
        $actions->post("logout");
        $actions->post("forgot-password");
        // User management
        $actions->patch("update-password");
        $actions->withId()->patch("approve");
        $actions->withId()->get("download-certificate");
      });

    $server->resource("old-users", JsonApiController::class)->readOnly();
  });

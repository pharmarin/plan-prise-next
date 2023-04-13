<?php

use App\Http\Middleware\VerifyCsrfToken;
use App\Mail\Registered as MailRegistered;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get("/plan/{file?}", function ($file = "index.php") {
  include LEGACY_PATH . "/plan/" . $file;
});

/* Route::get("/{assets}/{stylesheet}", function ($assets, $stylesheet) {
  return Response::file(LEGACY_PATH . "/" . $assets . "/" . $stylesheet);
})
  ->whereIn("assets", ["css", "js", "img", "fonts"])
  ->where("stylesheet", ".*");

Route::get("/plan/{file}", function ($file) {
  return Response::file(LEGACY_PATH . "/plan/" . $file);
})->whereIn("file", ["select2.css", "edit.js", "select.js", "load.js"]);

Route::middleware("auth")->group(function () {
  Route::get("/plan/{file?}", function ($file = "index.php") {
    include LEGACY_PATH . "/plan/" . $file;
  });

  Route::post("/plan", function () {
    include LEGACY_PATH . "/plan/index.php";
  })->withoutMiddleware(VerifyCsrfToken::class);

  Route::post("/plan/actions.php", function () {
    include LEGACY_PATH . "/plan/actions.php";
  })->withoutMiddleware(VerifyCsrfToken::class);

  Route::get("/calendrier/{file?}", function ($file = "index.php") {
    include LEGACY_PATH . "/calendrier/" . $file;
  });

  Route::post("/calendrier", function () {
    include LEGACY_PATH . "/calendrier/index.php";
  })->withoutMiddleware(VerifyCsrfToken::class);

  Route::get("/ajax/{file}", function ($file) {
    include LEGACY_PATH . "/ajax/" . $file;
  });
}); */

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

Route::get("/{assets}/{file}", function ($assets, $file) {
  return Response::file(LEGACY_PATH . "/" . $assets . "/" . $file);
})
  ->whereIn("assets", ["css", "js", "img", "files", "fonts"])
  ->where("file", ".*");

Route::get("/files/fiches/{file}", function ($file) {
  return Response::file(LEGACY_PATH . "/" . $file);
})
  ->where("file", ".*");

Route::get("/calendrier/image.php", function () {
  include LEGACY_PATH . "/calendrier/image.php";
});

Route::middleware("token")->group(function () {
  Route::get("/ajax/{file}", function ($file) {
    include LEGACY_PATH . "/ajax/" . $file;
  });

  Route::get("/calendrier/{file?}", function ($file = "index.php") {
    include LEGACY_PATH . "/calendrier/" . $file;
  });

  Route::post("/calendrier", function () {
    include LEGACY_PATH . "/calendrier/index.php";
  })->withoutMiddleware(VerifyCsrfToken::class);
});

Route::get('/', function () {
  return response()->redirectTo(env("FRONTEND_URL"), 301);
});

Route::fallback(function () {
  return response("Not found", 404);
});

<?php

namespace App\Http\Middleware;

use App\Models\User;
use Barryvdh\Debugbar\Facades\Debugbar;
use Closure;
use Error;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Auth;

class JwtMiddleware
{
  public function handle(Request $request, Closure $next)
  {
    // Vérifie si le header Authorization est présent
    if (!$request->header('Authorization')) {
      return response()->json(['error' => 'JWT non fourni.'], 401);
    }

    // Récupère le token JWT depuis le header Authorization
    $token = $request->header('Authorization');

    try {
      // Décodage du token JWT
      $decoded = JWT::decode($token, new Key(env('CROSS_SITE_SECRET'), 'HS256'));
      $user_id = $decoded->user_id;

      // Vérification si l'utilisateur est présent dans le token
      if (!$user_id) {
        return response()->json(['error' => 'ID utilisateur introuvable.'], 401);
      }

      if (Auth::onceUsingId($user_id)) {
        // Passe la requête au middleware suivant
        return $next($request);
      }

      throw new Error();
    } catch (\Exception $e) {
      // Retourne une erreur si le token est invalide ou expiré
      return response()->json(['error' => 'Token JWT invalide.'], 401);
    }
  }
}

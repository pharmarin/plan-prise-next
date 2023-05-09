<?php

namespace App\Http\Middleware;

use Closure;
use Error;
use Exception;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Auth;

class JwtMiddleware
{
  public function handle(Request $request, Closure $next)
  {
    try {
      // Vérifie si le header Authorization est présent
      if (!$request->header('Authorization')) {
        throw new Exception('JWT non fourni.');
      }

      // Récupère le token JWT depuis le header Authorization
      $token = $request->header('Authorization');

      // Décodage du token JWT
      $decoded = JWT::decode($token, new Key(env('CROSS_SITE_SECRET'), 'HS256'));
      $user_id = $decoded->user_id;

      // Vérification si l'utilisateur est présent dans le token
      if (!$user_id) {
        throw new Exception('ID utilisateur introuvable.');
      }

      if (Auth::onceUsingId($user_id)) {
        // Passe la requête au middleware suivant
        return $next($request);
      }

      throw new Error();
    } catch (\Exception $e) {
      // Retourne une erreur si le token est invalide ou expiré
      return response("Unauthorized", 401);
    }
  }
}

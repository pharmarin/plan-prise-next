<?php

use Illuminate\Support\Facades\DB;

global $dbh;

try {
  $dbh = DB::connection()->getPdo();
} catch (PDOException $e) {
  echo "Connexion à la base de données impossible : " . $e->getMessage();
  exit();
}

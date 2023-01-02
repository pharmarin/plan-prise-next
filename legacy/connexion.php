<?php

global $dbh;

$sql_server = env("DB_HOST");
$sql_database = env("DB_DATABASE");
$sql_login = env("DB_USERNAME");
$sql_password = env("DB_PASSWORD");
try {
  $dbh = new PDO(
    "mysql:host=" . $sql_server . ";dbname=" . $sql_database . ";charset=utf8",
    $sql_login,
    $sql_password
  );
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo "Connexion à la base de données impossible : " . $e->getMessage();
  exit();
}

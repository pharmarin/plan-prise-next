<?php

use Illuminate\Support\Facades\Auth;

include_once LEGACY_PATH . "/class/plandeprise.class.php";

$plan = new plandeprise();
$plan->prepare();
$plan->prepareModif();
$table = $plan->tableExists();

if (isset($_GET["vider"])) {
  //vider
  exit();
}
if ($table != 1) {
  $plan->create();
}
$list_col = $plan->listCol();
if (isset($_GET["ajout"]) && isset($_GET["id_medic"])) {
  //echo $_GET['id_medic'];
  echo $plan->ajout($_GET["id_medic"]);
} elseif (isset($_GET["supprime"]) && isset($_GET["id_medic"])) {
  echo $plan->supprime($_GET["id_medic"]);
} elseif (isset($_GET["resize"]) && isset($_GET["id_medic"])) {
  echo $plan->resize($_GET["id_medic"]);
} elseif (isset($_GET["coucher"])) {
  require LEGACY_PATH . "/connexion.php";
  $query =
    "UPDATE users SET PPcoucher = !PPcoucher WHERE login = '" .
    Auth::user()->old_user->login .
    "'";
  $sth = $dbh->exec($query);
  echo $query;
} elseif (
  isset($_GET["commentaire"]) &&
  isset($_GET["id_medic"]) &&
  isset($_GET["rang"]) &&
  isset($_GET["status"])
) {
  print_r(
    $plan->commentaire($_GET["id_medic"], $_GET["rang"], $_GET["status"])
  );
} elseif (
  isset($_GET["conservation"]) &&
  isset($_GET["id_medic"]) &&
  isset($_GET["texte"])
) {
  echo $plan->setconservation($_GET["id_medic"], $_GET["texte"]);
} elseif (
  isset($_GET["indication"]) &&
  isset($_GET["id_medic"]) &&
  isset($_GET["texte"])
) {
  echo $plan->setindication($_GET["id_medic"], $_GET["texte"]);
} else {
  echo "<pre>";
  print_r($_GET);
}

<?php

use Illuminate\Support\Facades\Auth;

switch ($_POST["voie"]) {
  case "oral":
    $voieAdministration = "Orale";
    break;
  case "cutane":
    $voieAdministration = "Cutanée";
    break;
  case "auriculaire":
    $voieAdministration = "Auriculaire";
    break;
  case "nasale":
    $voieAdministration = "Nasale";
    break;
  case "inhale":
    $voieAdministration = "Inhalée";
    break;
  case "vaginal":
    $voieAdministration = "Vaginale";
    break;
  case "oculaire":
    $voieAdministration = "Oculaire";
    break;
  case "rectale":
    $voieAdministration = "Rectale";
    break;
  case "IDerm":
    $voieAdministration = "Sous-cutanée";
    break;
  case "IMusc":
    $voieAdministration = "Intra-musculaire";
    break;
  case "IVein":
    $voieAdministration = "Intra-veineux";
    break;
  case "IUr":
    $voieAdministration = "Intra-urétrale";
    break;
  default:
    $voieAdministration = "Pas de voie attribuée";
}

$nomMedicament = addslashes($_POST["nomMedicament"]);
$nomGenerique = addslashes($_POST["nomGenerique"]);
$frigo = addslashes($_POST["frigo"]);
$dureeConservation = addslashes($_POST["dureeConservation"]);
$indication = addslashes($_POST["indication"]);
$voieAdministration = addslashes($voieAdministration);
$matin = addslashes($_POST["matin"]);
$midi = addslashes($_POST["midi"]);
$soir = addslashes($_POST["soir"]);
$commentaire = addslashes($_POST["commentaire"]);
$encode = explode("<br>", $commentaire);
for ($i = 0; $i < count($encode); $i++) {
  $encode[$i] = strip_tags(
    htmlspecialchars_decode($encode[$i]),
    "<br><a><b><u><i><sup><sub>"
  );
  if (strpos($encode[$i], "[") === 0) {
    $text = explode("]", $encode[$i]);
    $comment[$i]["text"] = trim($text[1]);
    $comment[$i]["span"] = substr($text[0], 1);
    $comment[$i]["status"] = "";
  } else {
    $comment[$i]["text"] = trim($encode[$i]);
    $comment[$i]["span"] = "";
    $comment[$i]["status"] = "checked";
  }
}
$commentaire = json_encode($comment, JSON_UNESCAPED_UNICODE);
$commentaire = str_replace("\\\\", "\\", $commentaire);
$commentaire = str_replace(
  ",{\"text\":\"\",\"span\":\"\",\"status\":\"checked\"}",
  "",
  $commentaire
);
//var_dump($commentaire);exit;
$precaution = $_POST["precaution"];

$edit_date = Auth::user()->admin ? "NOW()" : "0";

// connexion à la base de données

require "connexion.php";

$query =
  "INSERT INTO medics_simple (
	nomMedicament,
	nomGenerique,
	frigo,
	dureeConservation,
	indication,
	voieAdministration,
	matin,
	midi,
	soir,
	commentaire,
	modifie,
	precaution,
	qui
	)
VALUES (
	'" .
  $nomMedicament .
  "',
	'" .
  $nomGenerique .
  "',
	'" .
  $frigo .
  "',
	'" .
  $dureeConservation .
  "',
	'" .
  $indication .
  "',
	'" .
  $voieAdministration .
  "',
	'" .
  $matin .
  "',
	'" .
  $midi .
  "',
	'" .
  $soir .
  "',
	'" .
  $commentaire .
  "',
	" .
  $edit_date .
  ",
	'" .
  $precaution .
  "',
	'" .
  Auth::user()->old_user->login .
  "'
	)";

try {
  $dbh->exec($query);
} catch (PDOException $e) {
}

//echo $query;

header("Location: saisir.php");
exit();

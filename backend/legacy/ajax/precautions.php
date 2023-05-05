<?php

use Illuminate\Support\Facades\Auth;

ini_set("display_errors", "on");
error_reporting(E_ALL);

session_start();

if ($_GET["precaution"] == "valproate") {
  $nom_table = "PP_" . Auth::user()->id;
  $precaution = "Il est important d\'avoir une contraception efficace car ce médicament peut entrainer des effets graves sur l\'enfant à naître (troubles du développement, malformations). 
En cas de désir de grossesse, consultez votre médecin spécialiste. 
Le médecin vous a fait lire et signer un accord de soin que vous devez présenter pour toute délivrance de votre médicament. 
";

  require "../connexion.php";

  $query = "SELECT commentaire FROM $nom_table WHERE precaution = 'valproate'";
  $sth = $dbh->prepare($query);
  $sth->execute();

  while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
    $commentaire = $precaution . $row["commentaire"];

    require "../connexion.php";

    $query = "UPDATE $nom_table SET commentaire = '$commentaire', precaution = 'OK' WHERE precaution = 'valproate'";
    $sth = $dbh->prepare($query);
    $sth->execute();
  }

  $sth->closeCursor();

  echo "success";
}

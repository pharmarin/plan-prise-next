<?php

require LEGACY_PATH . "/connexion.php";

if (isset($_GET["id"])) {
  $id = $_GET["id"];
  $query = "UPDATE medics_simple SET relecture = '1' WHERE id = '$id'";
  $dbh->exec($query);
  echo $query;
} else {
  $pk = $_POST["pk"];
  $name = $_POST["name"];
  $value = addslashes($_POST["value"]);

  try {
    $query = "UPDATE medics_simple SET $name = '$value' WHERE id = '$pk'"; // Update database with the correct Id (line)

    $dbh->exec($query);
  } catch (PDOException $e) {
    echo $query . "<br>" . $e->getMessage();
  }

  echo $query;
}
?>

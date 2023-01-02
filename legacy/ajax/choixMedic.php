<?php // connect to database
require LEGACY_PATH . "/connexion.php";

$search = strip_tags(trim($_GET["q"]));

// Do Prepared Query
$query = "SELECT id, nomMedicament, nomGenerique FROM medics_simple WHERE (nomMedicament LIKE '%$search%' OR nomGenerique LIKE '%$search%') AND NOT modifie LIKE '0'";
$sth = $dbh->prepare($query);

// Add a wildcard search to the search variable
$resultat = $sth->execute();

// Do a quick fetchall on the results
$list = $sth->fetchall(PDO::FETCH_ASSOC);

// Make sure we have a result
if (count($list) > 0) {
  foreach ($list as $key => $value) {
    $data[] = [
      "id" => $value["id"],
      "text" => $value["nomMedicament"],
      "dci" => $value["nomGenerique"],
    ];
  }
} else {
  if ($_GET["options"] == "add" && !is_int($search) && !ctype_digit($search)) {
    $search = strtoupper($search);
    $data[] = ["id" => $search, "text" => "Ajouter " . $search, "dci" => ""];
  }
  if (count($data) == 0) {
    $data[] = ["id" => "0", "text" => "Aucun médicament correspondant"];
  }
}

// return the result in json
echo json_encode($data);

?>

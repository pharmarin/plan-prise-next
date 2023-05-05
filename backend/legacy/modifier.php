<?php

if ($_GET["modifier"] == "modifier") {
  function addslashes_array($a)
  {
    if (is_array($a)) {
      foreach ($a as $n => $v) {
        $b[$n] = addslashes_array($v);
      }
      return $b;
    } else {
      return addslashes($a);
    }
  }

  $count = count($_POST["nomMedicament"]);

  $nomMedicament = addslashes_array($_POST["nomMedicament"]);
  $nomGenerique = addslashes_array($_POST["nomGenerique"]);
  $frigo = addslashes_array($_POST["frigo"]);
  $dureeConservation = addslashes_array($_POST["dureeConservation"]);
  $indication = addslashes_array($_POST["indication"]);
  $voieAdministration = addslashes_array($_POST["voieAdministration"]);
  $commentaire_array = addslashes_array($_POST["commentaire"]);
  $id = $_POST["id"];
  $precaution = $_POST["precaution"];

  $comment = [];

  foreach ($commentaire_array as $commentaire) {
    $encode = explode("\n", $commentaire);
    if (count($encode) > 1) {
      //print_r($comment);
      for ($i = 0; $i < count($encode); $i++) {
        $encode[$i] = strip_tags(
          htmlspecialchars_decode($encode[$i]),
          "<br><a><b><u><i><sup><sub>"
        );
        if (strpos($encode[$i], "[") === 0) {
          $text = explode("]", $encode[$i]);
          $comment[$i] = [
            "text" => trim($text[1]),
            "span" => substr($text[0], 1),
            "status" => "",
          ];
        } else {
          $comment[$i] = [
            "text" => trim($encode[$i]),
            "span" => "",
            "status" => "checked",
          ];
        }
      }
    } else {
      if (strpos($encode[0], "[") === 0) {
        $text = explode("]", $encode[0]);
        $comment[0] = [
          "text" => trim($text[1]),
          "span" => substr($text[0], 1),
          "status" => "",
        ];
      } else {
        $comment[0] = [
          "text" => trim($encode[0]),
          "span" => "",
          "status" => "checked",
        ];
      }
    }
    $comment = json_encode($comment, JSON_UNESCAPED_UNICODE);
    $commentaire_json[] = str_replace("\\\\", "\\", $comment);
    $comment = [];
    $text = [];
  }

  //echo '<pre>';	print_r($commentaire_json);

  for ($i = 0; $i < $count; $i++) {
    switch ($voieAdministration[$i]) {
      case "oral":
        $voie = "Orale";
        break;
      case "cutane":
        $voie = "Cutanée";
        break;
      case "auriculaire":
        $voie = "Auriculaire";
        break;
      case "nasale":
        $voie = "Nasale";
        break;
      case "inhale":
        $voie = "Inhalée";
        break;
      case "vaginal":
        $voie = "Vaginale";
        break;
      case "oculaire":
        $voie = "Oculaire";
        break;
      case "rectale":
        $voie = "Rectale";
        break;
      case "IDerm":
        $voie = "Sous-cutanée";
        break;
      case "IMusc":
        $voie = "Intra-musculaire";
        break;
      case "IVein":
        $voie = "Intra-veineux";
        break;
      default:
        $voie = "Pas de voie attribuée";
    }

    require "connexion.php";

    $query = "UPDATE medics_simple SET nomMedicament='$nomMedicament[$i]', nomGenerique='$nomGenerique[$i]',
			frigo='$frigo[$i]', dureeConservation='$dureeConservation[$i]', indication='$indication[$i]',
			voieAdministration='$voie', commentaire='$commentaire_json[$i]',	modifie=NOW(), precaution='$precaution[$i]' WHERE id='$id[$i]'";

    //echo $query.'<br>';

    try {
      $dbh->exec($query);
    } catch (PDOException $e) {
    }
  }

  header("Location: modifier.php");
  exit();
} ?>

<!DOCTYPE html>
<html>
    <head>
        <title>Modifier un médicament</title>
        <?php include "head.php"; ?>
		<style>
			form .row {
				margin-bottom:2em;
			}
		</style>
    </head>
    <header><?php include "header.php"; ?></header>
    <body>
    	<div class="container">
    		<form class="form" method="GET" action="modifier.php">
    			<label for="recherche">Entrez le nom ou une partie du médicament : </label>
	    		<div class="row">
					<div class="col-xs-8">
						<input class="form-control" type="text" name="recherche" id="recherche">
					</div>
					<div class="col-xs-4">
						<input class="btn btn-sm btn-default" type="SUBMIT" value="Rechercher">
					</div>
				</div>
			</form>
		</div>

<?php if (isset($_GET["recherche"])) {

  $recherche = $_GET["recherche"];

  if (isset($_GET["colonne"])) {
    $colonne =
      $_GET["colonne"] . " LIKE '%" . $recherche . "%' AND modifie > 0";
  } elseif ($_GET["validate"]) {
    $colonne = "id=" . $_GET["validate"];
  } else {
    $colonne =
      "(nomMedicament LIKE '%" .
      $recherche .
      "%' OR nomGenerique LIKE '%" .
      $recherche .
      "%') AND modifie > 0";
  }

  require "connexion.php";
  $query =
    "SELECT * FROM medics_simple WHERE " . $colonne . " ORDER BY nomMedicament";
  $sth = $dbh->prepare($query);
  $resultat = $sth->execute();

  $count = $sth->rowCount();
  ?>
	<div class="container-fluid">
		<table  class="table table-striped table-bordered table-condensed">
			<thead class="thead-inverse">
				<th>Spécialité</th>
				<th>DCI</th>
				<th>Conservation</th>
				<th>Durée de conservation</th>
				<th>Indication</th>
				<th>Précaution</th>
				<th>Voie d'administration</th>
				<th>Commentaire</th>
			</thead>
			<tbody>
				<form method="POST" action="modifier.php?modifier=modifier">
	<?php while ($rows = $sth->fetch(PDO::FETCH_ASSOC)) { ?>
			    <tr>
			    	<input type="hidden" name="id[]" value="<?php echo $rows["id"]; ?>">
					<td>
						<input class="form-control input-sm" name="nomMedicament[]" type="text" id="nomMedicament" value="<?php echo $rows[
        "nomMedicament"
      ]; ?>">
					</td>
					<td>
						<input class="form-control input-sm" name="nomGenerique[]" type="text" id="nomGenerique" value="<?php echo $rows[
        "nomGenerique"
      ]; ?>">
					</td>
					<td><?php if ($rows["frigo"] == 0): ?>
			                        	<select class="form-control input-sm" name="frigo[]">
										    <option value="1">Frigo</option>
										    <option value="0" selected="selected">Température ambiante</option>
										</select>
			                        <?php elseif ($rows["frigo"] == 1): ?>
			                        	<select class="form-control input-sm" name="frigo[]">
										    <option value="1" selected="selected">Frigo</option>
										    <option value="0">Température ambiante</option>
										</select>
		                        <?php endif; ?>
                    </td>
					<td><textarea class="form-control input-sm" name="dureeConservation[]" id="dureeConservation" rows="2"><?php echo $rows[
       "dureeConservation"
     ]; ?></textarea></td>
					<td><input class="form-control input-sm" name="indication[]" type="text" id="indication" value="<?php echo $rows[
       "indication"
     ]; ?>"></td>
					<td><input class="form-control input-sm" name="precaution[]" type="text" id="precaution" value="<?php echo $rows[
       "precaution"
     ]; ?>"></td>
                    <td>
                    <?php if ($rows["voieAdministration"] == "Orale"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral" selected="selected">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif ($rows["voieAdministration"] == "Cutanée"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane" selected="selected">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif (
                      $rows["voieAdministration"] == "Auriculaire"
                    ): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire" selected="selected">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif ($rows["voieAdministration"] == "Nasale"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale" selected="selected">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif ($rows["voieAdministration"] == "Inhalée"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale" selected="selected">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif ($rows["voieAdministration"] == "Vaginale"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal" selected="selected">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif ($rows["voieAdministration"] == "Oculaire"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire" selected="selected">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif ($rows["voieAdministration"] == "Rectale"): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale" selected="selected">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif (
                      $rows["voieAdministration"] == "Sous-cutanée"
                    ): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm" selected="selected">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif (
                      $rows["voieAdministration"] == "Intra-musculaire"
                    ): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc" selected="selected">Intra-musculaire</option>
                                <option value="IVein">Intra-veineux</option>
                    	</select>
                    <?php elseif (
                      $rows["voieAdministration"] == "Intra-veineux"
                    ): ?>
                    	<select class="form-control input-sm" name="voieAdministration[]">
                                <option value="oral">Orale</option>
                                <option value="cutane">Cutanée</option>
                                <option value="auriculaire">Auriculaire</option>
                                <option value="nasale">Nasale</option>
                                <option value="inhale">Inhalée</option>
                                <option value="vaginal">Vaginale</option>
                                <option value="oculaire">Oculaire</option>
                                <option value="rectale">Rectale</option>
                                <option value="IDerm">Sous-cutanée</option>
                                <option value="IMusc">Intra-musculaire</option>
                                <option value="IVein" selected="selected">Intra-veineux</option>
                    	</select>
                    <?php else: ?>
                    	<input type="text" class="form-control input-sm" name="voieAdministration[]" value="<?= $rows[
                       "voieAdministration"
                     ] ?>">
                    <?php endif; ?>
                    </td>
					<td>
						<textarea class="form-control input-sm" name="commentaire[]" id="commentaire" rows="6" cols="50"><?php
      $com = json_decode($rows["commentaire"], true);
      for ($j = 0; $j < count($com); $j++) {
        if (strlen($com[$j]["span"]) > 0) {
          echo htmlspecialchars(
            "[" . $com[$j]["span"] . "] " . $com[$j]["text"]
          );
        } else {
          echo htmlspecialchars($com[$j]["text"]);
        }
        if ($j != count($com) - 1) {
          echo "\n";
        }
      }
      ?></textarea>
					</td>
				</tr>
		<?php } ?>
			    <tr>
					<td colspan="7" style="text-align:center"><input class="btn btn-sm" type="submit" name="modifier" value="Modifier"></td>
					</form>
			    </tr>
			</tbody>
  		</table>
	</div>
	<?php
} ?>
	<script>
		$('#recherche').focus();
	</script>
</body>
</html>

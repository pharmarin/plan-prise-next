<?php

require "connexion.php";
if (!isset($_GET["page"])) {
  $page = "A";
} else {
  $page = $_GET["page"];
}
if (!isset($_GET["tri"])) {
  $tri = "nomMedicament";
} else {
  $tri = $_GET["tri"];
}
$query =
  "SELECT * FROM medics_simple WHERE nomMedicament LIKE '" .
  $page .
  "%'  AND NOT modifie LIKE '0' ORDER BY " .
  $tri;
$sth = $dbh->query($query);
?>
	<thead class="thead-inverse">
		<tr>
			<th><a href='tableauMedicaments.php?tri=nomGenerique'>Nom du médicament</a></th>
			<th colspan="2">Conservation</th>
			<th><a href='tableauMedicaments.php?tri=indication'>Indication</a></th>
			<th><a href='tableauMedicaments.php?tri=voieAdministration'>Voie</a></th>
			<th colspan="2"><a href='tableauMedicaments.php?tri=commentaire'>Commentaire</a></th>
		</tr>
	</thead>
	<tbody>
<?php
while ($rows = $sth->fetch(PDO::FETCH_ASSOC)) { ?>
		<tr>
			<td class="hoverable">
				<dt><strong><?= $rows["nomMedicament"] ?></strong></dt>
				<dd><em><?= $rows["nomGenerique"] ?></em></dd>
			</td>
			<td style="text-align:center;">
				<?php if ($rows["frigo"] == 1): ?>
				<img src="img/flocon.png" height="15">
				<?php endif; ?>
			</td>
			<td>
				<?php if (!empty($rows["dureeConservation"])) {
      if (json_decode($rows["dureeConservation"]) == null) {
        echo $rows["dureeConservation"];
      } else {
        //echo '<ul>';
        foreach (
          json_decode($rows["dureeConservation"], true)
          as $key => $value
        ) {
          //echo '<li>'.$value.' : '.$key.'</li>';
          echo "- <em>" . $key . "</em> : " . $value . "<br>";
        }
        //echo '</ul>';
      }
    } ?>
			</td>
			<td>
				<?php if (strpos($rows["indication"], "OU") > 0) {
      $indication = explode(" OU ", $rows["indication"]);
      foreach ($indication as $key) {
        echo "- " . $key . "<br>";
      }
    } else {
      echo $rows["indication"];
    } ?>
			</td>
			<td>
				<?= $rows["voieAdministration"] ?>
			</td>
			<td class="commentaire">
				<?php
    $com = json_decode(htmlspecialchars_decode($rows["commentaire"]), true);
    //print_r ($com);
    for ($j = 0; $j < count($com); $j++) {
      echo $com[$j]["text"] . "<br>";
    }
    ?>
			</td>
			<td>
				<form method="post" action="ajout_pp.php">
					<input type="hidden" name="id_panier" value="<?= $rows["id"] ?>" />
					<button type="submit" class="btn btn-primary btn-xs" onclick="ajoutPP(<?= $rows[
       "id"
     ] ?>, '<?= addslashes(
  $rows["nomMedicament"]
) ?>', this);"><span class="glyphicon glyphicon-plus"></span></button>
				</form>
			</td>
		</tr>
<?php }
$sth->closeCursor();
$count = $sth->rowCount();
?>
	</tbody>
	<tfoot>
		<tr>
			<td class="gauche" colspan="5">Nombre d'entrées :</td>
			<td class="droite" colspan="2">
				<?php
    $query = "SELECT COUNT(id) AS count FROM medics_simple";
    $sth = $dbh->query($query);
    $total = $sth->fetch(PDO::FETCH_ASSOC);
    $total = $total["count"];
    echo $count . "/" . $total;
    ?>
			</td>
		</tr>
	</tfoot>

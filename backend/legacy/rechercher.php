
<!DOCTYPE html>
<html>
    <head>
        <title>Recherche de médicament</title>
        <?php include "head.php"; ?>
		<style>
			.commentaire {
				min-width:30em !important;
			}
		</style>
    </head>
    <header><?php include "header.php"; ?></header>
    <body>
<div class="container-fluid">

	<?php
 require "connexion.php";
 // Récupère la variable
 if (isset($_POST["recherche"])):

   $recherche = isset($_POST["recherche"]) ? $_POST["recherche"] : "";
   // la requete mysql
   ($query =
     "SELECT * FROM medics_simple WHERE modifie > 0 AND (nomMedicament LIKE '%" .
     $recherche .
     "%' OR nomGenerique LIKE '%" .
     $recherche .
     "%' OR indication LIKE '%" .
     $recherche .
     "%' OR commentaire LIKE '%" .
     $recherche .
     "%') ORDER BY nomMedicament") or die(mysql_error());
   $sth = $dbh->prepare($query);
   $resultat = $sth->execute();
   $nbResultat = $sth->rowCount();
   ?>
        <h1>
            <?php if ($nbResultat === 1): ?>
            Résultat de la recherche (<?= $nbResultat ?>)
            <?php elseif ($nbResultat === 0): ?>
            Aucun résultat...
            <?php exit();else: ?>
            Résultats de la recherche (<?= $nbResultat ?>)
            <?php endif; ?>
        </h1>
            <table class="table table-bordered">

            <thead>
                <tr>
                    <th>Nom du médicament</th>
                    <th>Conservation</th>
                    <th>Durée de conservation</th>
                    <th>Indication</th>
                    <th>Voie d'administration</th>
                    <th>Commentaire</th>
                </tr>
            </thead>
            <tbody>
                <?php
                while ($row = $sth->fetch(PDO::FETCH_ASSOC)) { ?>
                <tr>
                    <td>
						<dt><strong><?= $row["nomMedicament"] ?></strong></dt>
						<dd><em><?= $row["nomGenerique"] ?></em></dd>
					</td>
                    <td style="text-align:center;"><?php if (
                      $row["frigo"] == 1
                    ): ?>
                        <img src="img/flocon.png" height="15">
                        <?php endif; ?>
                    </td>
                    <td><?php if (!empty($row["dureeConservation"])) {
                      if (json_decode($row["dureeConservation"]) == null) {
                        echo $row["dureeConservation"];
                      } else {
                        //echo '<ul>';
                        foreach (
                          json_decode($row["dureeConservation"], true)
                          as $key => $value
                        ) {
                          //echo '<li>'.$value.' : '.$key.'</li>';
                          echo "- <em>" . $key . "</em> : " . $value . "<br>";
                        }
                        //echo '</ul>';
                      }
                    } ?></td>
                    <td><?php if (strpos($row["indication"], "OU") > 0) {
                      $indication = explode(" OU ", $row["indication"]);
                      foreach ($indication as $key) {
                        echo "- " . $key . "<br>";
                      }
                    } else {
                      echo $row["indication"];
                    } ?></td>
                    <td><?= $row["voieAdministration"] ?></td>
                    <td class="commentaire"><?php
                    $com = json_decode(
                      htmlspecialchars_decode($row["commentaire"]),
                      true
                    );
                    //print_r ($com);
                    for ($j = 0; $j < count($com); $j++) {
                      echo $com[$j]["text"] . "<br>";
                    }
                    ?></td>
                    <!-- <td><form method="post" id="formulaire" action="ajout_pp.php">
                    	<input type="hidden" name="id_panier" value="<?= $row[
                       "id"
                     ] ?>" />
                    	<button type="submit" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-plus"></span></button>
										</form>
									</td>-->
                </tr>
                <?php }
                $sth->closeCursor();
                ?>
            </tbody>
        </table>
</div>
    </body>
</html>
<?php
 else:
    ?>
<?php
 endif;


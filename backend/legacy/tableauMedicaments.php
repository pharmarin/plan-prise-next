<?php

use Illuminate\Support\Facades\Auth;

if (isset($_GET["tri"])) {
  $tri = $_GET["tri"];
} else {
  $tri = "nomMedicament";
}
?>

	<!DOCTYPE html>
	<html>

	<head>
		<?php include "head.php"; ?>
		<title>Tableau des médicaments</title>
		<link rel="stylesheet" href="css/tableauMedicaments.css">
	</head>
	<header>
		<?php include "header.php"; ?>
	</header>

	<body>

			<?php if (!Auth::user()->admin) { ?>

	<div id="intro" class="hidden-xs">
		<div id="contenu_intro">
			<div class="titre">
				<h1 class="text-center">Commencez à créer votre plan de prise ci-dessous</h1>
			</div>
			<div class="row">
				<div class="col-sm-6 col-sm-offset-3">
					<form class="form" method="post" id="ajout-pp" action="ajout_pp.php">
						<select id="choix-medic" class="form-control" name="id_medic" style="background-color:transparent">
        		</select>
					</form>
				</div>
			</div>
			<button type="button" class="center-block" id="aide">En savoir plus sur l'utilisation du site</button>
		</div>
	</div>

	<div id="medicaments"></div>

	<div id="suite">
		<div id="voir">
			<small>Voir les médicaments disponibles</small>
		</div>
		<a id="chevron" href="#medicaments">
			<span class="fa fa-angle-down"></span>
		</a>
	</div>

	<div id="slide2">

			<?php } ?>
		
		<?php
  require "connexion.php";
  $query =
    "SELECT id, nomMedicament, nomGenerique FROM medics_simple WHERE modifie LIKE '0' OR NULL";
  $sth = $dbh->prepare($query);
  $results = $sth->execute();
  $validate = $sth->fetchall(PDO::FETCH_ASSOC);
  if (count($validate) > 0 && Auth::user()->admin): ?>
				<div class="container">
					<h1>Médicaments à valider</h1>
					<table class="table table-bordered table-striped">
						<tbody>
							<?php foreach ($validate as $temp): ?>
							<tr>
								<td><?php echo $temp["nomMedicament"]; ?><br/><?php echo $temp[
  "nomGenerique"
]; ?></td>
								<td><a href="modifier.php?recherche&validate=<?php echo $temp[
          "id"
        ]; ?>" class="btn btn-warning">Valider</a></td>
							</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
			<?php endif;
  ?>

		<div class="container">
			<h1>Liste des médicaments</h1>
			<div class="text-center hidden-xs hidden-sm">
				<ul class="pagination">
				<?php
    $lettres = range("A", "Z");
    for ($i = 0; $i < count($lettres); $i++) {
      if ($i == 0) {
        echo '<li class="active" data-page="' .
          $lettres[$i] .
          '"><a href="#">' .
          $lettres[$i] .
          "</a></li>";
      } else {
        echo '<li data-page="' .
          $lettres[$i] .
          '"><a href="#">' .
          $lettres[$i] .
          "</a></li>";
      }
    }
    ?>
				</ul>
			</div>
			<div class="hidden-md hidden-lg">
				<select class="pagination form-control">
					<?php for ($i = 0; $i < count($lettres); $i++) {
       if ($i == 0) {
         echo '<option selected="selected">' . $lettres[$i] . "</li>";
       } else {
         echo "<option>" . $lettres[$i] . "</li>";
       }
     } ?>
				</select>
			</div>
			<table class="table table-bordered table-striped">
			<?php include "tableau_include.php"; ?>
			</table>
			<div class="text-center hidden-xs hidden-sm">
				<ul class="pagination">
				<?php for ($i = 0; $i < count($lettres); $i++) {
      $query =
        "SELECT COUNT(id) AS count FROM medics_simple WHERE nomMedicament LIKE '" .
        $lettres[$i] .
        "%'";
      $sth = $dbh->query($query);
      $initiale = $sth->fetch(PDO::FETCH_ASSOC);
      if ($i == 0) {
        echo '<li class="active" data-page="' .
          $lettres[$i] .
          '"><a href="#">' .
          $lettres[$i] .
          "</a></li>";
      } elseif ($initiale["count"] == 0) {
        echo '<li class="disabled" data-page="' .
          $lettres[$i] .
          '"><a href="#">' .
          $lettres[$i] .
          "</a></li>";
      } else {
        echo '<li data-page="' .
          $lettres[$i] .
          '"><a href="#">' .
          $lettres[$i] .
          "</a></li>";
      }
    } ?>
				</ul>
			</div>
			<div class="hidden-md hidden-lg">
				<select class="pagination form-control">
					<?php for ($i = 0; $i < count($lettres); $i++) {
       $query =
         "SELECT COUNT(id) AS count FROM medics_simple WHERE nomMedicament LIKE '" .
         $lettres[$i] .
         "%'";
       $sth = $dbh->query($query);
       $initiale = $sth->fetch(PDO::FETCH_ASSOC);
       if ($i == 0) {
         echo '<option selected="selected">' . $lettres[$i] . "</li>";
       } elseif ($initiale["count"] == 0) {
         echo '<option disabled="disabled">' . $lettres[$i] . "</li>";
       } else {
         echo "<option>" . $lettres[$i] . "</li>";
       }
     } ?>
				</select>
			</div>

	<?php if (!Auth::user()->admin) { ?>

		</div>

	<?php } ?>

		<div class="scroll-top-wrapper ">
		  <span class="scroll-top-inner">
		    <span class="glyphicon glyphicon-chevron-up"></span></br><span style="font-size:0.80em">Haut<br>de page</span>
		  </span>
		</div>
		<div class="preload" style="display:none;">
			<span class="fa fa-circle-o-notch"></span>
		</div>
	</div>
				<span class="fa fa-circle-o-notch fa-spin" style="color:white"></span>
		<script src="js/tableauMedicaments.js"></script>
	<?php if (!Auth::user()->admin) {
   echo '<script src="js/tour.js"></script>';
 } ?>
	</body>
	</html>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>Relecture</title>
	<link rel="stylesheet" href="css/bootstrap.min.css"></link>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js" type="text/javascript"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<link href="css/bootstrap-editable.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/js/bootstrap-editable.min.js"></script>
    <script type="text/javascript" src="js/relecture-editable.js"></script>
    <style>
    	table {font-size:90%;}
    	td a {
    		text-decoration:none !important;
    		color:inherit;
    	}
    </style>
</head>
<header><?php
use Illuminate\Support\Facades\Auth;

include "header.php";
?></header>
<body>
	<div class="container">
		<div class="row">
			<?php
   require LEGACY_PATH . "/connexion.php";

   $login = Auth::user()->old_user->login;

   $query = "SELECT * FROM medics_simple WHERE qui != '$login' AND relecture != '1' ORDER BY id";
   $sth = $dbh->query($query);
   ?>
			<table class="table table-bordered table-striped">
						<thead class="thead-inverse">
							<tr>
								<th>Nom du médicament</th>
								<th colspan="2">Conservation</th>
								<th>Indication</th>
								<th>Voie</th>
								<th>Commentaire</th>
								<th>Relu</th>
							</tr>
						</thead>
						<tbody>
							<?php
       while ($row = $sth->fetch(PDO::FETCH_ASSOC)) { ?>
							<tr>
								<td>
									<a href="#" class="modif" data-type="text" data-name="nomMedicament" data-pk="<?= $row[
           "id"
         ] ?>" data-url="editable_relecture.php"><?= $row[
  "nomMedicament"
] ?></a></br>
									<small><em><?= $row["nomGenerique"] ?></em></small>
								</td>
								<td style="text-align:center;">
									<?php if ($row["frigo"] == 1): ?>
									<img src="flocon.png" height="15">
									<?php endif; ?>
								</td>
								<td>
									<a href="#" class="modif" data-type="text" data-name="dureeConservation" data-pk="<?= $row[
           "id"
         ] ?>" data-url="editable_relecture.php"><?= $row[
  "dureeConservation"
] ?></a>
								</td>
								<td>
									<a href="#" class="modif" data-type="text" data-name="indication" data-pk="<?= $row[
           "id"
         ] ?>" data-url="editable_relecture.php"><?= $row["indication"] ?></a>
								</td>
								<td>
									<a href="#" class="modif" data-type="text" data-name="voieAdministration" data-pk="<?= $row[
           "id"
         ] ?>" data-url="editable_relecture.php"><?= $row[
  "voieAdministration"
] ?></a>
								</td>
								<td>
									<a href="#" class="modif_commentaire" data-type="textarea" data-name="commentaire" data-pk="<?= $row[
           "id"
         ] ?>" data-url="editable_relecture.php"><?= htmlspecialchars(
  $row["commentaire"]
) ?></a>
								</td>
								<td>
									<input type="checkbox" onClick="go(<?= $row["id"] ?>, this);">
								</td>
							</tr>
							<?php }
       $sth->closeCursor();
       ?>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="5">Nombre d'entrées :</td>
								<td class="droite">
									<?= $sth->rowCount() ?>
								</td>
							</tr>
						</tfoot>
			</table>
		</div
	</div>
</body>
</html>
<script>
function go(id, attribut) {
	
	$.ajax({
        url: 'editable_relecture.php',
        type: 'GET',
        data: 'id=' + id,
        success: function () {
        	attribut.style.display='none';
        }
    });
}
</script>
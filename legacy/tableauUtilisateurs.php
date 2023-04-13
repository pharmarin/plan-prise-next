<!DOCTYPE html>
<html>

<head>

	<head>
		<?php include "head.php"; ?>
		<title>Tableau des Utilisateurs</title>
	</head>
</head>
<header><?php include "header.php"; ?></header>

<body>
	<div class="container">
		<h1>Statistiques</h1>
		<table class="table table-bordered table-striped table-condensed">
			<?php
			// SELECT * FROM plans_old WHERE MONTH(TIME) = 2
			// SELECT COUNT(*), MONTH(TIME) FROM plans_old WHERE TIME BETWEEN SUBDATE(CURRENT_DATE(), INTERVAL 1 YEAR) AND CURRENT_DATE() GROUP BY MONTH(TIME)
			require "connexion.php";
			$query =
				"SELECT COUNT(*) AS COUNT, MONTH(TIME) AS MONTH FROM plans_old WHERE TIME > LAST_DAY(SUBDATE(CURRENT_DATE(), INTERVAL 1 YEAR)) GROUP BY MONTH(TIME)";
			$sth = $dbh->query($query);
			$row = $sth->fetchAll(PDO::FETCH_ASSOC);
			foreach ($row as $key => $value) {
				$plans[$value["MONTH"]] = $value["COUNT"];
			}
			$current_month = date("n");
			$current_year = date("y");

			//var_dump($plans);
			?>
			<tr>
				<td>
					Mois
				</td>
				<?php
				$month = $current_month;
				for ($i = 0; $i < 12; $i++) : ?>
					<td class="text-center">
						<?php echo date("M", mktime(0, 0, 0, $month, 10)) . " " . $current_year; ?>
					</td>
				<?php
					$month = $month == 1 ? 12 : $month - 1;
					$current_year = $month == 12 ? $current_year - 1 : $current_year;
				endfor;
				?>
			</tr>
			<tr>
				<td>
					Plans de prise
				</td>
				<?php
				$month = $current_month;
				for ($i = 0; $i < 12; $i++) : ?>
					<td class="text-center">
						<?php echo isset($plans[$month]) ? $plans[$month] : 0; ?>
					</td>
				<?php $month = $month == 1 ? 12 : $month - 1;
				endfor;
				?>
			</tr>

			<?php
			require "connexion.php";
			$query =
				"SELECT COUNT(*) AS COUNT, MONTH(TIME) AS MONTH FROM calendriers_old WHERE TIME > LAST_DAY(SUBDATE(CURRENT_DATE(), INTERVAL 1 YEAR)) GROUP BY MONTH(TIME)";
			$sth = $dbh->query($query);
			$row = $sth->fetchAll(PDO::FETCH_ASSOC);
			foreach ($row as $key => $value) {
				$calendars[$value["MONTH"]] = $value["COUNT"];
			}

			//var_dump($calendars);
			?>
			<tr>
				<td>
					Calendriers
				</td>
				<?php
				$month = $current_month;
				for ($i = 0; $i < 12; $i++) : ?>
					<td class="text-center">
						<?php echo isset($calendars[$month]) ? $calendars[$month] : 0; ?>
					</td>
				<?php $month = $month == 1 ? 12 : $month - 1;
				endfor;
				?>
			</tr>

			<?php
			require "connexion.php";
			$query =
				"SELECT COUNT(*) AS COUNT, MONTH(inscription) AS MONTH FROM users WHERE inscription > LAST_DAY(SUBDATE(CURRENT_DATE(), INTERVAL 1 YEAR)) GROUP BY MONTH(inscription)";
			$sth = $dbh->query($query);
			$row = $sth->fetchAll(PDO::FETCH_ASSOC);
			foreach ($row as $key => $value) {
				$users[$value["MONTH"]] = $value["COUNT"];
			}

			//var_dump($users);
			?>
			<tr>
				<td>
					Inscriptions
				</td>
				<?php
				$month = $current_month;
				for ($i = 0; $i < 12; $i++) : ?>
					<td class="text-center">
						<?php echo isset($users[$month]) ? $users[$month] : 0; ?>
					</td>
				<?php $month = $month == 1 ? 12 : $month - 1;
				endfor;
				?>
			</tr>
		</table>
		<h1>Liste des utilisateurs</h1>
		<h2>
			En attente d'activation
		</h2>
		<?php
		require "connexion.php";
		$query = "SELECT * FROM users WHERE active = 0 ORDER BY admin DESC, id ASC";
		$sth = $dbh->query($query);
		?>
		<table class="table table-bordered table-striped">

			<thead>
				<tr>
					<th>Statut</th>
					<th>Inscription</th>
					<th>Nom d'utilisateur</th>
					<th>Mail</th>
					<th>Nom Complet</th>
					<th>Statut</th>
					<th>RPPS</th>
					<th>Supprimer</th>
				</tr>
			</thead>
			<tbody>
				<?php
				while ($row = $sth->fetch(PDO::FETCH_ASSOC)) { ?>
					<tr>
						<td><?php if ($row["active"] == 1) {
									echo "Actif";
								} else {
								?>
								<a href='ajoutUser.php?active=<?= $row["Id"] ?>'>Activer</a>
							<?php
								} ?>
						</td>
						<td>
							<?php if ($row["inscription"] != "2017-09-18 10:15:08") {
								echo date("d/m/Y", strtotime($row["inscription"]));
							} ?>
						</td>
						<td><?= $row["login"] ?></td>
						<td><?= $row["mail"] ?></td>
						<td><?= ucwords(strtolower($row["fullname"])) ?></td>
						<td>
							<?php switch ($row["status"]) {
								case 0:
									echo "Pharmacien";
									break;
								case 1:
									echo "Établissement";
									break;
								case 2:
									echo "Étudiant";
									break;
							} ?>
						</td>
						<td><?= $row["rpps"] ?></td>
						<td><a href='ajoutUser.php?supprime=<?= $row["Id"] ?>' onClick="confirmation(event, '<?= $row["fullname"] ?>');"><span class="glyphicon glyphicon-trash"></span></a></td>
					</tr>
				<?php }
				$sth->closeCursor();
				?>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="7">Nombre d'utilisateurs :</td>
					<td class="droite"><?= $sth->rowCount() ?></td>
				</tr>
			</tfoot>
		</table>
		<h2>
			Actifs
		</h2>
		<?php
		require "connexion.php";
		$query = "SELECT * FROM users WHERE active = 1 ORDER BY admin DESC, id ASC";
		$sth = $dbh->query($query);
		?>
		<table class="table table-bordered table-striped">

			<thead>
				<tr>
					<th>Statut</th>
					<th>Administrateur</th>
					<th>Nom d'utilisateur</th>
					<th>Mail</th>
					<th>Nom Complet</th>
					<th>Statut</th>
					<th>RPPS</th>
					<th>Supprimer</th>
				</tr>
			</thead>
			<tbody>
				<?php
				while ($row = $sth->fetch(PDO::FETCH_ASSOC)) { ?>
					<tr>
						<td><?php if ($row["active"] == 1) {
									echo "Actif";
								} else {
								?>
								<a href='ajoutUser.php?active=<?= $row["login"] ?>'>Activer</a>
							<?php
								} ?>
						</td>
						<td style="text-align:center"><?php if ($row["admin"] == 1) : ?>
								<span class="glyphicon glyphicon-eye-open"></span>
							<?php endif; ?>
						</td>
						<td><?= $row["login"] ?></td>
						<td><?= $row["mail"] ?></td>
						<td><?= ucwords(strtolower($row["fullname"])) ?></td>
						<td>
							<?php switch ($row["status"]) {
								case 0:
									echo "Pharmacien";
									break;
								case 1:
									echo "Établissement";
									break;
								case 2:
									echo "Étudiant";
									break;
							} ?>
						</td>
						<td><?= $row["rpps"] ?></td>
						<td><a href='ajoutUser.php?supprime=<?= $row["Id"] ?>' onClick="confirmation(event, '<?= $row["fullname"] ?>');"><span class="glyphicon glyphicon-trash"></span></a></td>
					</tr>
				<?php }
				$sth->closeCursor();
				?>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="7">Nombre d'utilisateurs :</td>
					<td class="droite"><?= $sth->rowCount() ?></td>
				</tr>
			</tfoot>
		</table>
		<ul>
			<li>
				<p><a href="saisieUser.php">Ajouter un utilisateur</a></p>
			</li>
		</ul>
	</div>
</body>
<script>
	function confirmation(e, text) {
		if (confirm("Supprimer " + text + " ?")) {
			return
		}
		e.preventDefault();
	}
</script>

</html>
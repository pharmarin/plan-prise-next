<?php global $_url, $include, $data, $id, $data_colonnes, $toprintid;

if (isset($toprintid)) {
	$id = $toprintid;
}
$print = true;

//List calendars
$plans = plan_list();
if (!isset($id)) {
	$id = $plans[0]["id"];
}

//Read database
$data = plan_read($id);
$data_colonnes = plan_read_colonnes($data);
$options = plan_read_options($id);

if (isset($data["new"])) { ?>
	<h3 class="text-center">Le plan de prise est vide... </h3>
<?php return;
}

$color = [
	"th" => [
		"lever" => "66ffd5",
		"matin" => "90e793",
		"dixh" => "fff566",
		"midi" => "ffbc81",
		"seizeh" => "e68ec7",
		"dixhuith" => "c48ee6",
		"soir" => "ffa19c",
		"coucher" => "b8e4f5",
	],
	"tr" => [
		"lever" => "99ffe3",
		"matin" => "baf0bc",
		"dixh" => "fff899",
		"midi" => "ffd7b4",
		"seizeh" => "efb8dc",
		"dixhuith" => "dab8ef",
		"soir" => "ffd2cf",
		"coucher" => "e4f5fb",
	],
];
?>
<html>

<head>
	<title>Plan de prise</title>
	<?php require LEGACY_PATH . "/head.php"; ?>
	<link href="<?= $_url ?>/css/plan.css" rel="stylesheet" />
	<link href="<?= $_url ?>/css/plan-print.css" rel="stylesheet" />
</head>

<body style="background: transparent;">
	<?php $count_col = 3; ?>
	<table class="table table-bordered table-condensed">
		<thead>
			<tr>
				<th>Médicament</th>
				<th>Indication</th>
				<?php
				if (
					!plan_empty_col("frigo", $id) ||
					!plan_empty_col("dureeConservation", $id)
				) :
					$count_col++; ?>
					<th <?php if (
								!plan_empty_col("frigo", $id) &&
								!plan_empty_col("dureeConservation", $id)
							) {
								echo "colspan='2'";
								$count_col++;
							} ?>>
						Conservation
					</th>
				<?php
				endif;
				foreach ($options["poso"] as $col => $label) :
					$count_col++; ?>
					<th class="poso <?= $col ?>" style="background-color:#<?= $color["th"][$col] ?>;"><?= $label ?></th>
				<?php
				endforeach;
				?>
				<th class="commentaire">Commentaire</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($data as $row) : ?>
				<tr>
					<td>
						<b><?= preg_replace("/[ ]+(?=\D)/", "&nbsp;", $row["nomMedicament"]) ?></b><br />
						<em class="text-muted"><?php if (!empty($row["nomGenerique"])) {
																			echo $row["nomGenerique"];
																		} ?></em><br />
						<small class="text-muted"><?php if (
																				!empty($row["voieAdministration"])
																			) { ?>(Voie <?= strtolower(
																										$row["voieAdministration"]
																									) ?>)<?php } ?></small>
					</td>
					<td>
						<?= $row["indication"] ?>
						<?php
						$indication = plan_preprocess_indication($row["indication"]);
						if (!is_array($indication)) {
							echo $row["indication"];
						}
						?>
					</td>
					<?php if (!plan_empty_col("frigo", $id)) : ?>
						<td>
							<?php if ($row["frigo"] == 1) {
								echo '<img src="' . $_url . '/img/flocon.png" height="15">';
							} ?>
						</td>
					<?php endif; ?>
					<?php if (!plan_empty_col("dureeConservation", $id)) : ?>
						<td>
							<?= $row["dureeConservation"] ?>
						</td>
					<?php endif; ?>
					<?php foreach ($options["poso"] as $col => $label) : ?>
						<td class="poso <?= $col ?>" style="background-color:#<?= $color["tr"][$col] ?>;">
							<?= array_key_exists($col, $row) ?
								$row[$col] : "" ?>
						</td>
					<?php endforeach; ?>
					<td class="commentaire">
						<?php
						if (is_array($row["commentaire"])) :
							foreach ($row["commentaire"] as $commentaire) : ?>
								<?php if ($commentaire["status"] == "checked") : ?>
									<div class="commentaire-line">
										<?= $commentaire["text"] ?>
									</div>
									<div style="font-size: 1mm;">&nbsp;</div>
								<?php endif; ?>
							<?php endforeach;
						endif;
						if (
							!empty($row["commentaire"]) &&
							!empty($row["commentairePerso"])
						) : ?>
							<hr><?php endif;
									?>
						<div>
							<span class="commentaire-perso"><?= array_key_exists(
																								"commentairePerso",
																								$row
																							) ? $row["commentairePerso"] : "" ?></span>
						</div>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>

	</table>
	<?php if (!plan_empty_col("frigo", $id)) : ?>
		<div style="margin-top: 1em; text-align: right;">
			<img src="<?php echo $_url; ?>/img/flocon.png" height="15"> : À conserver au frigo (entre +2°C et +8°C) avant ouverture
		</div>
	<?php endif; ?>
	<?php if ($precautions = plan_precautions(true)) : ?>
		<div class="precautions">
			<?= $precautions ?>
		</div>
	<?php endif; ?>
</body>

</html>
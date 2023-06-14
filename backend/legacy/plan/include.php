<?php

global $_url, $data, $id, $data_colonnes;

if (isset($data["new"]) || empty($data)) { ?>
	<table style="width:100%;">
		<!-- Plan de prise : New -->
		<tbody>
			<tr>
				<td>
					<h3 class="text-center">Ajoutez un nouveau médicament pour commencer le plan de prise. </h3>
					<?php
					//var_dump($data)
					?>
				</td>
			</tr>
		</tbody>
	</table>
<?php return;
}
?>
<?php $count_col = 3;
// On compte les colonnes pour avoir le scolpan pour tfoot
// Par défaut : Médicament + Indication + Indication
?>
<table class="table table-bordered table-condensed" data-id_plan="<?= $id ?>">
	<!-- Plan de prise : <?= $id ?> -->
	<thead>
		<tr>
			<th>Médicament</th>
			<th>Indication</th>
			<?php if (
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
			endif; ?>
			<?php foreach ($options["poso"] as $col => $label) : ?>
				<th class="poso <?= $col ?>"><?= $label ?></th>
			<?php $count_col++;
			endforeach; ?>
			<th class="commentaire">Commentaire</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($data as $key => $row) : ?>
			<tr>
				<td>
					<span class="fa fa-remove remove text-warning" data-row="<?= $key ?>" data-toggle="tooltip" title="Supprimer" data-placement="left"></span> <b><?= preg_replace(
																																																																														"/[ ]+(?=\D)/",
																																																																														"&nbsp;",
																																																																														$row["nomMedicament"]
																																																																													) ?></b><br />
					<em class="text-muted"><?php if (!empty($row["nomGenerique"])) {
																		echo $row["nomGenerique"];
																	} ?></em><br />
					<small class="text-muted"><?php if (
																			!empty($row["voieAdministration"])
																		) { ?>(Voie <?= strtolower($row["voieAdministration"]) ?>)<?php } ?></small>
				</td>
				<td>
					<?php
					$indication = plan_preprocess_indication($row["indication"]);
					if (count($indication) > 1) {
						echo "<form>";
						foreach ($indication as $indication) : ?>
							<label>
								<input type="radio" class="editable" name="indication" <?= plan_print_data(
																																					$key,
																																					"indication"
																																				) ?>><?= $indication ?>
							</label><br>
						<?php endforeach;
						echo "</form>";
					} else {
						?>
						<span class="editable toload" <?= plan_print_data(
																						$key,
																						"indication"
																					) ?> contenteditable="true"><?= $indication[0] ?></span>
					<?php
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
						<?php
						$dureeConservation = plan_preprocess_conservation(
							$row["dureeConservation"]
						);
						if (is_array($dureeConservation)) {
							echo "<form>";
							foreach ($dureeConservation as $labo => $dureeConservation) : ?>
								<label>
									<input type="radio" class="editable" data-value="<?= $dureeConservation ?>" <?= plan_print_data(
																																																$key,
																																																"dureeConservation"
																																															) ?>><?= $labo ?>
								</label><br>
							<?php endforeach;
							echo "</form>";
						} else {
							?>
							<span class="editable toload" <?= plan_print_data(
																							$key,
																							"dureeConservation"
																						) ?> contenteditable="false"><?= $dureeConservation ?></span>
						<?php
						}
						?>
					</td>
				<?php endif; ?>
				<?php foreach ($options["poso"] as $col => $label) : ?>
					<td class="poso <?= $col ?>" onClick="$(this).find('span.editable').focus();">
						<span class="editable toload" <?= plan_print_data(
																						$key,
																						$col
																					) ?> contenteditable="true"><?= array_key_exists($col, $row) ?
																																				$row[$col] : "" ?></span>
					</td>
				<?php endforeach; ?>
				<td class="commentaire">
					<?php if (!empty($row["commentaire"])) :
						if (is_array($row["commentaire"])) :
							for ($i = 0; $i < count($row["commentaire"]); $i++) : ?>
								<span class="line">
									<input type="checkbox" class="editable toload" <?= plan_print_data(
																																		$key,
																																		"status",
																																		$i
																																	) ?> <?php if ($row["commentaire"][$i]["status"] == "checked") {
																																					echo "checked='checked'";
																																				} ?>>
									<span class="population"><em class="text-muted"><?= $row["commentaire"][$i]["span"] ?></em></span>
									<span class="editable toload commentaire-line <?php
																																if (!empty($row["commentaire"][$i]["span"])) {
																																	echo "inline";
																																}
																																if ($row["commentaire"][$i]["status"] != "checked") {
																																	echo " notSelected";
																																}
																																?>" <?= plan_print_data(
																																			$key,
																																			"text",
																																			$i
																																		) ?> contenteditable="true"><?= preg_replace(
																																																	'/ ?<a href="/',
																																																	'</span> <span class="fa fa-arrow-right"></span> <a href="http://' .
																																																		$_SERVER["HTTP_HOST"] .
																																																		"/",
																																																	$row["commentaire"][$i]["text"]
																																																) ?></span>
								</span>
								<br />
						<?php endfor;
						endif; ?>
						<hr>
					<?php
					endif; ?>
					<div>
						<span class="editable toload commentaire-perso" <?= plan_print_data(
																															$key,
																															"commentairePerso"
																														) ?> contenteditable="true"><?= array_key_exists(
																																													"commentairePerso",
																																													$row
																																												) && $row["commentairePerso"] ?></span>
					</div>
				</td>
			</tr>
		<?php endforeach; ?>
		<?php if (!plan_empty_col("frigo", $id)) : ?>
			<tr>
				<td colspan="<?php echo $count_col; ?>" style="text-align: right; border-color: transparent;">
					<div style="margin-top: 0.5em;">
						<img src="<?php echo $_url; ?>/img/flocon.png" height="15"> : À conserver au frigo (entre +2°C et +8°C) avant ouverture
					</div>
				</td>
			</tr>
		<?php endif; ?>
	</tbody>
</table>
<?php if (!plan_empty_col("frigo", $id)) : ?>
	<tr>
		<td colspan="<?php echo $count_col; ?>" style="text-align: right; border-color: transparent;">
			<div style="margin-top: 0.5em;">
				<img src="<?php echo $_url; ?>/img/flocon.png" height="15"> : À conserver au frigo (entre +2°C et +8°C) avant ouverture
			</div>
		</td>
	</tr>
<?php endif; ?>
<div class="precautions">
	<?= plan_precautions() ?>
</div>
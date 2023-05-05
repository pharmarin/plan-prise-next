<?php global $_url, $cols, $toheader, $data, $data_colonnes, $id;

include_once LEGACY_PATH . "/plan/fonctions.php";

//Pre-process post
if (isset($_GET["id"])) {
	$id = $_GET["id"];
}
if (isset($_POST["id"])) {
	$id = $_POST["id"];
}
if (isset($_GET["delete"]) && isset($_GET["id"])) :
	plan_delete($id);
	header("Location: /plan/");
endif;
if (isset($_POST["print"]) && isset($_POST["id"])) :
	$patient = filter_var($_POST["patient"], FILTER_SANITIZE_STRING);
	plan_print($id, $patient);
endif;

//List calendars
$plans = plan_list();

if (!isset($id)) {
	$id = $plans[0]["id"];
}

//Read database
$data = plan_read($id);
$data_colonnes = plan_read_colonnes($data);

//print_r ($data); exit;

$head = "<select onChange='location = this.value' class='form-control'>";
if (empty($id) || $id == "new") {
	$head .= "<option>Nouveau plan de prise</option>";
}
foreach ($plans as $key => $plan) :
	$key++;
	$head .= "<option value='/plan/?id=" . $plan["id"] . "'";
	if ($plan["id"] == $id) {
		$head .= " selected='selected'";
	}
	$head .= ">Plan de prise " . $plan["id"] . "</option>";
endforeach;
$head .= "</select>";
$toheader[] = $head;
if (count($plans) > 0) {
	if ($id != "new") {
		$head = '<span class="btn-group" style="padding: 5px 0;">';
		$head .=
			'<a href="#print" data-toggle="modal"><span class="btn btn-round btn-xs btn-plain btn-warning" data-toggle="tooltip" title="Imprimer" data-placement="bottom"><span class="fa fa-print"></span></span></a>';
		$head .=
			'<a href="/plan/?delete&id=' .
			$id .
			'" id="delete" onClick="confirmation(event)" data-toggle="tooltip" title="Supprimer" data-placement="bottom"><span class="btn btn-round btn-xs btn-plain btn-danger"><span class="fa fa-times"></span></span></a>';
		$head .= "</span>";
		$toheader[] = $head;
	}
	$toheader[] =
		'<a href="' .
		$_url .
		'/plan/?id=new" style="padding: 5px 0;"><span class="btn btn-round btn-xs btn-plain btn-success" data-toggle="tooltip" title="Nouveau plan de prise" data-placement="bottom"><span class="fa fa-plus"></span></span></a>';
}
?>
<html>

<head>
	<title>Plan de prise</title>
	<?php include LEGACY_PATH . "/head.php"; ?>
	<link href="<?= $_url ?>/css/plan.css" rel="stylesheet" />
	<link href="/plan/select2.css" rel="stylesheet" />
</head>

<body>
	<div id="print" class="modal" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<div class="row">
						<form method="POST" action="/plan/" target="_blank">
							<input type="hidden" name="print" />
							<input type="hidden" name="id" value="<?= $id ?>" />
							<div class="col-xs-12">
								<input type="text" class="form-control" name="patient" placeholder="Nom du patient" />
							</div>
							<div class="col-xs-6">
								<button type="submit" class="print btn btn-primary" style="width:100%;">
									Imprimer
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<header><?php include LEGACY_PATH . "/header.php"; ?></header>
	<div class="plan container-fluid">
		<?php $options = plan_read_options($id); ?>
		<div id="mask-wrapper">
			<div id="mask">
				<div class="loader">
					<h3 class="text-center">Patientez pendant que nous chargeons votre plan de prise. </h3>
					<div class="progress">
						<div class="progress-bar progress-bar-striped progress-bar-success active"></div>
					</div>
				</div>
			</div>
			<div id="mask-content">
				<div class="col-xs-8">
					<form class="form-ajout" method="get" action="/plan/actions.php">
						<select id="choix-medic" class="form-control" name="ajout_medic" multiple="multiple">
							<option>Ajouter un médicament au plan de prise</option>
						</select>
					</form>
				</div>
				<div class="col-xs-4">
					<form>
						<?php
						$counter = 0;
						$col_0 = "";
						$col_1 = "";

						foreach ($cols as $possible_col => $possible_label) :
							if ($counter < count($cols) / 2) {
								$col_0 .=
									'<label><input type="checkbox" class="option" name="poso" value="' .
									$possible_col .
									'" ';
								if (array_key_exists($possible_col, $options["poso"])) {
									$col_0 .= 'checked="checked"';
								}
								$col_0 .= ">" . $possible_label . "</label><br>";
							} else {
								$col_1 .=
									'<label><input type="checkbox" class="option" name="poso" value="' .
									$possible_col .
									'" ';
								if (array_key_exists($possible_col, $options["poso"])) {
									$col_1 .= 'checked="checked"';
								}
								$col_1 .= ">" . $possible_label . "</label><br>";
							}
							$counter++;
						endforeach;
						unset($counter);
						?>
						<div class="col-xs-6 horaires">
							<?= $col_0 ?>
						</div>
						<div class="col-xs-6 horaires">
							<?= $col_1 ?>
						</div>
					</form>
				</div>
				<div id="include-box" class="col-xs-12">
					<?php
					$include = true;
					require_once "include.php";
					?>
				</div>
			</div>
		</div>
	</div>
	<?php include_once LEGACY_PATH . "/footer.php"; ?>
	<script type="text/javascript" src="/plan/load.js"></script>
	<script type="text/javascript" src="/plan/edit.js"></script>
	<script type="text/javascript" src="/plan/select.js"></script>
</body>

</html>
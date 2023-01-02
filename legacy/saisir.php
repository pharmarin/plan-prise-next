<?php

use Illuminate\Support\Facades\Auth;

include_once LEGACY_PATH . "/class/plandeprise.class.php";

$plan = new plandeprise();
$contenu = $plan->prepare();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Ajout d'un médicament</title>
        <?php include "head.php"; ?>
		<style>
			#editeur, #resultat {
				width: 100% !important;
			    height: 250px !important;
			    overflow: auto !important;
			    display:inline-block;
			}
		</style>
		<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css" rel="stylesheet"/>
    </head>
    <header><?php include "header.php"; ?></header>
	<body>
    <div class="container">
    	<legend>Saisie d'un nouveau médicament</legend>
		<?php if (!Auth::user()->admin): ?>
			<div class="alert alert-success">
				Le médicament sera ajouté après validation par les administrateurs. 
			</div>
		<?php endif; ?>
		<form action="ajouter.php" class="form" method="POST" id="ajouter">
		<div class="col-xs-4">
			<div class="form-group">
				<label for="nomMedicament">Nom du médicament : </label>
				<input type="text" class="form-control" id="nomMedicament" name="nomMedicament" maxlength="50">
				<small class="form-text text-muted">En lettres capitales, avec le dosage. </small>
			</div>
			<div class="form-group">
				<label for="nomGenerique">D.C.I.</label>
				<input type="text" class="form-control" name="nomGenerique" maxlength="100">
			</div>
			<div class="form-group">
				<label for="indication">Indication</label>
				<input type="text" class="form-control" name="indication">
				<small class="form-text text-muted">Si plusieurs indications les séparer<br/>par " OU ". </small>
			</div>
		</div>
		<div class="col-xs-4">
			<div class="form-group">
				<label for="frigo">Conservation</label>
				<select class="form-control" name="frigo">
		            <option value="1">Frigo</option>
		            <option value="0" selected="selected">Température ambiante</option>
		        </select>
		    </div>
			<div class="form-group">
				<label for="dureeConservation">Durée de conservation</label>
				<input type="text" class="form-control" name="dureeConservation" maxlength="200">
				<small class="form-text text-muted">Durée et modalités de conservation après ouverture. <br/>Exemple : 7 jours à température ambiante (max 25°C)</small>
			</div>
			<div class="form-group">
				<label for="precaution">Précaution</label>
				<select id="precaution" name="precaution" multiple="multiple">
					<?= $plan->precautionJSON() ?>
				</select>
			</div>
		</div>
		<div class="col-xs-4">
			<div class="form-group">
				<label for="voie">Voie d'administration</label>
				<select class="form-control" name="voie">
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
		            <option value="IUr">Intra-urétrale</option>
		        </select>
		    </div>
			<div class="form-group">
				<label for="commentaire">Commentaire : </label>
				<div id="editeur" class="form-control" contentEditable></div>
				<small class="help-block">[Population concernée] Indication <br/>Exemple: [Immunodéprimé] Consulter en urgence en cas de fièvre. </small>
				<textarea style="display:none;" id="resultat" name="commentaire"></textarea>
			</div>
			<input type="submit" class="btn btn-default btn-block" onclick="result();" value="Ajouter">
		</div>
		</form>
    </div>
    <div class="row">
    	<div class="col-sm-6 col-sm-offset-3" style="text-align:center;">
    		<button class="btn btn-link" data-toggle="modal" data-target="#conservations"><span class="fa fa-heartbeat"></span> Ajouter plusieurs durées de conservation</button>
    	</div>
    </div>
    

    <div id="conservations" class="modal fade" role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal">&times;</button>
	        <h4 class="modal-title">Ajouter plusieurs conservations <button type="button" class="add btn btn-info btn-xs"><span class="glyphicon glyphicon-plus"></span></button></h4>
	      </div>
	      <div class="modal-body">
	        <form id="conservations_form" class="form-inline" method="POST">
			    <div class="clone hidden">
				    <input type="text" name="labo" class="form-control" placeholder="Laboratoire"/>
				    <input type="text" name="duree" class="form-control" placeholder="Conservation"/>
			    </div>
			    <div class="cloned">
				    <input type="text" name="labo" class="form-control" placeholder="Laboratoire"/>
				    <input type="text" name="duree" class="form-control" placeholder="Conservation"/>
			    </div>
			    <div class="cloned">
				    <input type="text" name="labo" class="form-control" placeholder="Laboratoire"/>
				    <input type="text" name="duree" class="form-control" placeholder="Conservation"/>
			    </div>
	      </div>
	      <div class="modal-footer">
	        <button type="submit" class="btn btn-success">Fermer</button>
	        </form>
	      </div>
	    </div>

	  </div>
	</div>
	<script src="js/replace.selection.js"></script>
	<script src="js/saisir.js"></script>
	<script type="text/javascript">
		$('#nomMedicament').focus();
		$("#precaution").select2({
			tags: true,
			maximumSelectionLength: 2
		});
		$(window).bind('keydown', function(event) {
		    if (event.ctrlKey || event.metaKey) {
		        switch (String.fromCharCode(event.which).toLowerCase()) {
		        case 's':
		            event.preventDefault();
		            $('#ajouter').submit();
		            break;
		        }
		    }
		});
	</script>
	</body>
</html>

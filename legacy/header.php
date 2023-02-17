<?php

use Illuminate\Support\Facades\Auth;

global $toheader, $isindex;
?>
<nav class="<?php if (Auth::user()->admin) {
  echo "admin navbar navbar-inverse ";
} ?>navbar-fixed-top">
	<div class="container-fluid nav-content">
		<?php if (!$isindex): ?>
			<div class="">
				<a class="navbar-brand" href="/"><span class="glyphicon glyphicon-home"></span></a>
			</div>
		<?php endif; ?>
		<div id="myNavbar">
<?php if (Auth::user()->admin): ?>
			<ul class="navbar-nav navbar-search">
				<form method="POST" action="/rechercher.php" class="search-box-top"  style="height:100%;">
					<li>
						<input type="search" name="recherche" placeholder="Recherchez... (princeps ou DCI)" class="form-control" id="search-top" <?php if (
        isset($_POST["recherche"])
      ) {
        echo 'value="' . $_POST["recherche"] . '"';
      } ?>>
						<span class="search-close-top glyphicon glyphicon-remove" style="color:white;"></span>
					</li>
				</form>
			</ul>
			<ul class="nav navbar-nav navbar-hide">
				<li class="hidden-xs">
					<a href="#" class="search-icon-top"><span class="glyphicon glyphicon-search"></span><span class="hidden-xs hidden-sm hidden-md"> Rechercher</span></a>
				</li>
				 <li class="dropdown">
					<a data-toggle="dropdown" id="mondropdown" href="#"><span class="glyphicon glyphicon-edit"></span> Médicaments<b class="caret"></b></a>
					<ul class="dropdown-menu">
						<li><a href="/tableauMedicaments.php"><span class="glyphicon glyphicon-star"></span> Tous</a></li>
					    <li><a href="/saisir.php"><span class="glyphicon glyphicon-download"></span> Ajouter</a></li>
					    <li><a href="/modifier.php"><span class="glyphicon glyphicon-pencil"></span> Modifier</a></li>
					  	<li><a href="/precaution.php"><span class="glyphicon glyphicon-warning-sign"></span> Gérer les précautions</a></li>
					    <li><a href="/relecture.php"><span class="glyphicon glyphicon-ok"></span> Relecture</a></li>
					</ul>
				</li>
				<li id="PP" class="navbar-inline hidden-xs hidden-sm">
					<a href="/plan/"><span class="glyphicon glyphicon-list-alt"></span></a>
				</li>
				<li id="cal" class="navbar-inline hidden-xs hidden-sm">
					<a href="/calendrier/"><span class="glyphicon glyphicon-calendar"></span></a>
				</li>
			</ul>
<?php endif; ?>
<?php if (isset($toheader)): ?>
			<ul class="nav navbar-nav center-block">
				<?php foreach ($toheader as $header): ?>
					<li>
						<?= $header ?>
					</li>
				<?php endforeach; ?>
			</ul>
<?php endif; ?>
			<ul class="nav navbar-nav navbar-right">
<?php if (Auth::user()->admin): ?>
				<li>
					<a href="/tableauUtilisateurs.php"><span class="glyphicon glyphicon-user"></span><span class="hidden-xs hidden-sm hidden-md"> Utilisateurs</span></a>
				</li>
<?php else: ?>
				<li>
					<a href="/edit_profile.php"><span class="glyphicon glyphicon-user"></span><span class="hidden-xs hidden-sm hidden-md"></span></a>
				</li>
				<li>
					<a href="#" data-toggle="modal" data-target="#aide" onClick="$('.modal-body iframe').attr('src', 'https://docs.google.com/file/d/0BxqO4Mhkl7kXY1l6N1VOblNRbHc/preview');"><i class="fa fa-question-circle"></i></a>
				</li>
<?php endif; ?>
				<li id="nom" class="hidden-xs hidden-sm">
					<a><span><?= ucwords(strtolower(Auth::user()->displayName)) ?></span></a>
				</li>
				<li id="deco">
					<a href="/fermer-session.php"><span class="glyphicon glyphicon-log-in"></span> Déconnexion</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
<div id="aide" class="modal fade" role="dialog">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Comment utiliser ce site ? </h4>
			</div>
			<div class="modal-body">
				<div class="embed-responsive embed-responsive-4by3">
					<iframe class="embed-responsive-item" ></iframe>
				</div>
			</div>
		</div>
	</div>
</div>

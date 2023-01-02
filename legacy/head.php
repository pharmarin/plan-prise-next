<noscript>
  <META HTTP-EQUIV="Refresh" CONTENT="0;URL=nojs.html">
</noscript>
<?php
use Illuminate\Support\Facades\Auth;

global $_url, $racine, $print;
?>
<!-- meta -->
<meta charset="UTF-8">
<?php
/*<meta name="viewport" content="width=device-width, initial-scale=1">*/
?>
<!-- css -->
<link rel="stylesheet" href="<?= $_url ?>/css/styles.css">
<?php if ($print !== true): ?>
	<link rel="stylesheet" href="https://use.fontawesome.com/6abc73dd53.css">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/select2-bootstrap-theme/0.1.0-beta.6/select2-bootstrap.min.css" rel="stylesheet" />
	<?php
  /*<link href="https://cdnjs.cloudflare.com/ajax/libs/hopscotch/0.2.5/css/hopscotch.min.css" rel="stylesheet"/>*/
  ?>
	<?php if (Auth::user()->admin): ?>
		<link rel="stylesheet" href="<?= $_url ?>/css/admin.css">
	<?php endif; ?>
	<!-- scripts -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js" type="text/javascript"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js"></script>
	<script src="<?= $_url ?>/js/select2/js/i18n/fr.js"></script>
	<?php
  /*<script src="https://cdnjs.cloudflare.com/ajax/libs/hopscotch/0.2.5/js/hopscotch.min.js"></script>*/
  ?>
	<?php include LEGACY_PATH . "/js/js.php";endif; ?>
<script>
function confirmation(e) {
  if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
    return
  }
  e.preventDefault();
}
</script>

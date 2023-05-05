<?php

use Illuminate\Support\Facades\Auth;

global $_url;
?>
<div class="footer">
  <div class="container">
    <div class="col-xs-3 contact">
      <a href="<?php echo $_url; ?>/contact-form.php">Contactez-nous</a>
    </div>
    <?php if (Auth::user()->admin): ?>
    <div class="col-xs-3 contact">
      <a href="<?php echo $_url; ?>/saisir.php">Ajouter un médicament</a>
    </div>
    <?php endif; ?>
    <div class="col-xs-6 copyright">
      Copyright: Marion et Marin 2016 – <a href="/mentions_legales.php">Mentions légales</a>
    </div>
  </div>
</div> 
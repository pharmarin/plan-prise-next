<?php
include_once "class/plandeprise.class.php";
$plan = new plandeprise();

if ($_GET["modifier"] == "modifier") {
  /*echo '<pre>';
	print_r ($_POST);
	echo '</pre>';*/

  function addslashes_array($a)
  {
    if (is_array($a)) {
      foreach ($a as $n => $v) {
        $b[$n] = addslashes_array($v);
      }
      return $b;
    } else {
      return addslashes($a);
    }
  }

  $count = count($_POST["mot_cle"]);

  $mot_cle = addslashes_array($_POST["mot_cle"]);
  $titre = addslashes_array($_POST["titre"]);
  $contenu = addslashes_array($_POST["contenu"]);
  $couleur = addslashes_array($_POST["couleur"]);
  $id = $_POST["id"];
  $comment = $_POST["comment"];

  for ($i = 0; $i < $count; $i++) {
    require "connexion.php";

    if ($comment[$i] == "UPDATE") {
      $query =
        "UPDATE precautions_old SET mot_cle='" .
        $mot_cle[$i] .
        "', titre='" .
        $titre[$i] .
        "',
				contenu='" .
        $contenu[$i] .
        "', couleur='" .
        $couleur[$i] .
        "' WHERE id='" .
        $id[$i] .
        "'";
    } elseif ($comment[$i] == "INSERT") {
      $query =
        "INSERT INTO precautions_old (mot_cle, titre, contenu, couleur) VALUES ('" .
        $mot_cle[$i] .
        "', '" .
        $titre[$i] .
        "',
				'" .
        $contenu[$i] .
        "', '" .
        $couleur[$i] .
        "')";
    }

    $dbh->exec($query);

    //echo $query.'<br>';
  }
}
?>

<!DOCTYPE html>
<html>

<head>
  <title>Gérer les précautions</title>
  <?php include "head.php"; ?>
  <style>
    .prec-mot {
      text-align: center;
      margin-bottom: 1em;
    }

    .panel-body .prec-contenu {
      width: 100%;
      height: 15em;
    }

    .panel-heading .prec-titre {
      width: 75%;
      color: white;
      font-size: 110%;
      background-color: transparent;
      border: 0;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }

    .panel-heading label {
      margin-left: 5%;
    }
  </style>
</head>
<header><?php include "header.php"; ?></header>

<body>
  <?php
  require "connexion.php";
  $query = "SELECT * FROM precautions";
  $sth = $dbh->prepare($query);
  $resultat = $sth->execute();

  $count = $sth->rowCount();
  ?>
  <div class="container">
    <form method="POST" action="precaution.php?modifier=modifier" class="form-inline">
      <div class="conteneur">
        <?php
        $i = 0;
        while ($rows = $sth->fetch(PDO::FETCH_ASSOC)) {
          if ($i != 0) {
            echo "<hr>";
          } ?>
          <div <?php if ($i == 0) {
                  echo 'class="clone"';
                } ?>>
            <input type="hidden" class="id" name="id[]" value="<?php echo $rows["id"]; ?>">
            <input type="hidden" class="comment" name="comment[]" value="UPDATE">
            <div class="mot">
              <label for="mot_cle[]">Mot clé : </label>
              <input class="form-control input-sm prec-mot" name="mot_cle[]" type="text" value="<?php echo $rows["mot_cle"]; ?>">
            </div>
            <div class="panel panel-warning" style="border-color:#e7e7e7">
              <div class="panel-heading" style="background-color:<?php echo $rows["couleur"]; ?> !important;color:white;border-color:#e7e7e7">
                <input class="form-control input-sm prec-titre" name="titre[]" type="text" value="<?php echo $rows["titre"]; ?>">
                <label for="couleur[]">Couleur : </label>
                <input class="form-control input-sm couleur" type="color" name="couleur[]" value="<?php echo $rows["couleur"]; ?>">
              </div>
              <div class="panel-body">
                <textarea class="form-control input-sm prec-contenu" name="contenu[]"><?php echo htmlspecialchars(
                                                                                        $rows["contenu"]
                                                                                      ); ?></textarea>
              </div>
            </div>
          </div>
        <?php $i++;
        }
        ?>
      </div>
      <input class="btn btn-sm" type="submit" name="modifier" value="Modifier">
    </form>
    <input class="btn btn-sm" id="ajouter" value="Ajouter">
  </div>
</body>
<script>
  $('#ajouter').click(function() {
    $('.clone').clone().removeClass('clone').addClass('cloned').appendTo('.conteneur');
    $('.cloned').find('.id').val('').end()
      .find('.comment').val('INSERT').end()
      .find('.mot_cle').val('').end()
      .find('.titre').val('').end()
      .find('.contenu').val('').end()
      .find('.couleur').val('').end()
      .find('.panel-heading').css('background-color', 'white !important').end();
  });

  $('.couleur').keyup(function() {
    var newColor = $(this).val();
    $(this).parent().attr('style', 'background-color:' + newColor + ' !important;color:white;border-color:#e7e7e7');
  });
</script>

</html>
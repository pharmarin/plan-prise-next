<?php

use Illuminate\Support\Facades\Auth;

require LEGACY_PATH . "/connexion.php";

if (isset($_POST["submit_edit"])) {
  foreach ($_POST as $the_key => $the_post) {
    switch ($the_key) {
      case "fullname":
        $uname = trim(filter_input(INPUT_POST, "fullname", FILTER_UNSAFE_RAW));
        $sth = $dbh->prepare("UPDATE users SET fullname = ? WHERE login = ?");
        try {
          $sth->execute([$uname, Auth::user()->id]);
        } catch (PDOException $e) {
          echo $e->getMessage();
        }
        $notif = ["alert-success" => "Le nom a été correctement modifié. "];
        break;
      case "mail":
        $umail = trim(filter_input(INPUT_POST, "mail", FILTER_SANITIZE_EMAIL));
        $sth = $dbh->prepare("UPDATE users SET mail = ? WHERE login = ?");
        try {
          $sth->execute([$umail, Auth::user()->id]);
        } catch (PDOException $e) {
          echo $e->getMessage();
        }
        $notif = [
          "alert-success" => 'L\'adresse mail a été correctement modifiée. ',
        ];
        break;
      case "rpps":
        $urpps = trim(filter_input(INPUT_POST, "rpps", FILTER_UNSAFE_RAW));
        $sth = $dbh->prepare("UPDATE users SET rpps = ? WHERE login = ?");
        try {
          $sth->execute([$urpps, Auth::user()->id]);
        } catch (PDOException $e) {
          echo $e->getMessage();
        }
        $notif = [
          "alert-success" => "Le numéro RPPS a été correctement modifié. ",
        ];
        break;
      default:
        break;
    }
  }
}
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Modifier les informations</title>
  <?php include "head.php"; ?>
</head>
<header><?php include "header.php"; ?></header>

<body>
  <?php
  $sth = $dbh->prepare(
    "SELECT fullname, mail, rpps FROM users WHERE login = ?"
  );
  try {
    $sth->execute([Auth::user()->id]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  $user = $sth->fetchAll(PDO::FETCH_ASSOC);
  if (count($user) > 1) {
    echo 'Un problème est survenu, merci de contacter l\'administrateur';
    exit();
  }
  $user = $user[0];
  $infos = [
    "fullname" => "Nom ou pharmacie",
    "mail" => "Adresse mail",
    "rpps" => "N° RPPS ou étudiant",
  ];
  ?>
  <div class="container">
    <?php if (isset($notif)) {
      foreach ($notif as $the_notif_status => $the_notif) {
        echo "<div class='alert " .
          $the_notif_status .
          "'>" .
          $the_notif .
          "</div>";
      }
    } ?>
    <div class="col-xs-6 col-xs-offset-3">
      <legend>Modifier les informations</legend>
      <?php foreach ($infos as $the_info => $the_label) : ?>
        <?php if ($the_info == $_GET["edit"]) : ?>
          <form class="form" method="POST" action="<?php echo $_SERVER["PHP_SELF"]; ?>">
          <?php endif; ?>
          <div class="row">
            <div class="col-xs-10">
              <h4>
                <?php echo $the_label; ?>
              </h4>
              <?php if ($the_info == $_GET["edit"]) : ?>
                <input type="text" class="form-control" name="<?php echo $the_info; ?>" value="<?php echo $user[$the_info]; ?>" />
              <?php else : ?>
                <?php echo $user[$the_info]; ?>
              <?php endif; ?>
            </div>
            <div class="col-xs-2">
              <?php if ($the_info != $_GET["edit"]) : ?>
                <br />
                <a href="<?php echo $_SERVER["PHP_SELF"]; ?>?edit=<?php echo $the_info; ?>" class="btn btn-xs btn-danger">Modifier</a>
              <?php else : ?>
                <br /><br />
                <button type="submit" class="btn btn-xs btn-success" name="submit_edit">OK</button>
              <?php endif; ?>
            </div>
          </div>
          <?php if ($the_info == $_GET["edit"]) : ?>
          </form>
        <?php endif; ?>
      <?php endforeach; ?>
    </div>
  </div>

</body>

</html>
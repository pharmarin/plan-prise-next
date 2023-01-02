<?php

include LEGACY_PATH . "/config.php";

if (isset($_GET["active"])) {
  require LEGACY_PATH . "/connexion.php";

  $query = "UPDATE users SET active='1' WHERE id = '" . $_GET["active"] . "'";
  $dbh->exec($query);
  $query = "SELECT * FROM users WHERE id = '" . $_GET["active"] . "'";
  $sth = $dbh->query($query);
  $result = $sth->fetch(PDO::FETCH_ASSOC);

  $contenu = file_get_contents(LEGACY_PATH . "/mail/activation.html");
  $contenu = str_replace("#URL#", $config["infos"]["url_site"], $contenu);
  $contenu = str_replace("#IDENTIFIANT#", $result["mail"], $contenu);

  require LEGACY_PATH . "/class/phpmail.class.php";
  $mail->Subject = "Activation de votre compte";
  $mail->MsgHTML($contenu);
  $mail->AltBody =
    "Votre sur " .
    $config["infos"]["url_site"] .
    " est maintenant activé. <br />
	Vous pouvez vous connecter avec l'identifiant et le mot de passe fournis lors de l'inscription. ";
  $mail->AddAddress($result["mail"], $result["fullname"]);
  $mail->send();

  header("Location: tableauUtilisateurs.php");
  exit();
} elseif (isset($_GET["supprime"])) {
  require "connexion.php";

  $query = "DELETE FROM users WHERE id = '$_GET[supprime]'";
  $dbh->exec($query);

  header("Location: tableauUtilisateurs.php");
  exit();
} else {

  // connexion à la base de données

  $data = $_POST["login"] . $_POST["password"];
  $password = hash("md5", $data);

  require "connexion.php";

  try {
    $dbh = new PDO(
      "mysql:host=$sql_server;dbname=$sql_database",
      $sql_login,
      $sql_password
    );
    $query = "INSERT INTO users (admin, login, password, fullname)
	VALUES ('$_POST[admin]', '$_POST[login]', '$password', '$_POST[fullname]')";
    $dbh->exec($query);
  } catch (PDOException $e) {
    echo $query . "<br>" . $e->getMessage();
  }
  $dbh = null;
  ?>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Ajout d'un utilisateur</title>
        <link rel="stylesheet" href="tableau.css">
    </head>
    <body>
        <h2>L'utilisateur à bien été ajouté à la base!</h2>

 <p><a href="tableauMedicaments.php">Retourner à l'accueil</a></p>
      <?= $password ?>
    </body>
</html>
 <?php
}

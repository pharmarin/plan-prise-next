<pre><?php
require_once LEGACY_PATH . "connexion.php";

$query = "SHOW TABLE STATUS FROM u200031500_bdm LIKE 'users'";
$sth = $dbh->prepare($query);
try {
  $sth->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
}
//echo '<pre>';
//print_r($sth->fetch(PDO::FETCH_ASSOC));
$datetime1 = new DateTime("now");
$datetime2 = new DateTime($sth->fetch(PDO::FETCH_ASSOC)["Update_time"]);
$interval = $datetime1->diff($datetime2);
$interval = $interval->format("%H");
echo "Intervale : " . intval($interval) . "<br/>";
if ($interval < 48) {
  $query = "SELECT * FROM users WHERE active = 0";
  $sth = $dbh->prepare($query);
  try {
    $sth->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  //print_r($sth->fetchAll(PDO::FETCH_ASSOC));

  include LEGACY_PATH . "/config.php";
  $contenu = file_get_contents(LEGACY_PATH . "/mail/pending.html");
  $contenu = str_replace("#URL#", $config["infos"]["url_site"], $contenu);

  $users = $sth->fetchAll(PDO::FETCH_ASSOC);

  if (!empty($users)) {
    $pending = "<ul>";
    foreach ($users as $user) {
      switch ($user["status"]) {
        case 0:
          $status = "Pharmacien";
          break;
        case 1:
          $status = "Établissement";
          break;
        case 2:
          $status = "Étudiant";
          break;
      }
      $pending .= "<li>";
      $pending .= $user["fullname"];
      $pending .= " (" . $status;
      if ($user["status"] != 2) {
        $pending .= " – RPPS : " . $user["rpps"];
      }
      $pending .= ")";
      $pending .= "</li>";
    }
    $pending .= "</ul>";

    $contenu = str_replace("#PENDING#", $pending, $contenu);

    require "class/phpmail.class.php";
    $mail->Subject = "En attente d'activation...";
    $mail->MsgHTML($contenu);
    $mail->AltBody = $altbody;
    $mail->AddAddress("plandeprise@gmail.com", "Marin et Marion");

    if (!$mail->Send()) {
      echo "Mailer Error: " . $mail->ErrorInfo;
    }
  }
}


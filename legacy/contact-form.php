<?php

use PHPMailer\PHPMailer\PHPMailer;

if (isset($_POST["submit"])) {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $message = htmlspecialchars($_POST["message"]);

  require "class/recaptchalib.php";
  $secret = "6LfeZyUTAAAAAEtpVgkr9BLxsXR1eCP7vx2EcTel";
  $response = null;
  $reCaptcha = new ReCaptcha($secret);
  if ($_POST["g-recaptcha-response"]) {
    $response = $reCaptcha->verifyResponse(
      $_SERVER["REMOTE_ADDR"],
      $_POST["g-recaptcha-response"]
    );
  }
  if ($response != null && $response->success) {
  } else {
    $errHuman = "Your anti-spam is incorrect";
  }

  // Check if name has been entered
  if (!$_POST["name"]) {
    $errName = 'Merci d\'indiquer un nom';
  }

  // Check if email has been entered and is valid
  if (!$_POST["email"] || !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    $errEmail = 'Merci d\'indiquer une adresse mail exacte. ';
  }

  //Check if message has been entered
  if (!$_POST["message"]) {
    $errMessage = 'Merci d\'entrer un message. ';
  }

  // If there are no errors, send the email
  if (!$errName && !$errEmail && !$errMessage && !$errHuman) {
    include LEGACY_PATH . "/config.php";
    $message_title = "Demande d'informations";
    $message_corps = "<p>De : " . $name . " (" . $email . ")</p>";
    $message_corps .= "<p>Message : </p>";
    $message_corps .= "<p>" . $message . "</p>";

    $phpmailer = new PHPMailer();
    $phpmailer->CharSet = "UTF-8";
    $phpmailer->From = $config["infos"]["mail"];
    $phpmailer->FromName = "Plan de prise";
    $phpmailer->Subject = $message_title;
    include LEGACY_PATH . "/page_mail.php";
    $phpmailer->MsgHTML($message_corps);
    $phpmailer->AltBody =
      "Nouveau message de " . $name . " (" . $email . ") : " . $message;
    $phpmailer->AddAddress("marionetmarin@gmail.com", "Admins");
    $phpmailer->addReplyTo($email, $name);
    $phpmailer->send();

    $alert = "<div class='alert alert-success'>";
    $alert .= "Votre message a été envoyé. ";
    $alert .= "</div>";
  }
}
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <?php include "head.php"; ?>
    <title>Formulaire de contact</title>
    <script src='https://www.google.com/recaptcha/api.js?hs=fr'></script>
  </head>
  <body>
  	<div class="container">
      <?= $alert ?>
  		<div class="row">
  			<div class="col-md-6 col-md-offset-3">
  				<h1 class="page-header text-center">Formulaire de contact</h1>
				<form class="form-horizontal" role="form" method="post" action="<?= $_SERVER[
      "REQUEST_URI"
    ] ?>">
					<div class="form-group">
						<label for="name" class="col-sm-2 control-label">Nom</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="name" name="name" placeholder="Nom et Prénom ou Nom de la pharmacie" value="<?php echo htmlspecialchars(
         $_POST["name"]
       ); ?>">
							<?php echo "<p class='text-danger'>$errName</p>"; ?>
						</div>
					</div>
					<div class="form-group">
						<label for="email" class="col-sm-2 control-label">Email</label>
						<div class="col-sm-10">
							<input type="email" class="form-control" id="email" name="email" placeholder="exemple@domaine.fr" value="<?php echo htmlspecialchars(
         $_POST["email"]
       ); ?>">
							<?php echo "<p class='text-danger'>$errEmail</p>"; ?>
						</div>
					</div>
					<div class="form-group">
						<label for="message" class="col-sm-2 control-label">Message</label>
						<div class="col-sm-10">
							<textarea class="form-control" rows="4" name="message"><?php echo htmlspecialchars(
         $_POST["message"]
       ); ?></textarea>
							<?php echo "<p class='text-danger'>$errMessage</p>"; ?>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-10">
							<div class="g-recaptcha" data-sitekey="6LfeZyUTAAAAACH1pgeet7YtYvaoqOEWFF7OYLPc"></div>
							<?php echo "<p class='text-danger'>$errHuman</p>"; ?>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-10 col-sm-offset-2">
              <div class="col-sm-8">
							  <input id="submit" name="submit" type="submit" value="Envoyer" class="btn btn-primary btn-block">
              </div>
              <div class="col-sm-4">
                <a href="index.php" class="btn btn-default btn-block">Retour</a>
              </div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-10 col-sm-offset-2">
							<?php echo $result; ?>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
  </body>
</html>

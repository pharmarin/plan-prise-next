<?php require PUBLIC_PATH . "/class/PHPMailer/PHPMailerAutoload.php";
$mail = new PHPMailer();
$mail->CharSet = "UTF-8";
$mail->From = $config["infos"]["mail"];
$mail->FromName = "Plan de prise";

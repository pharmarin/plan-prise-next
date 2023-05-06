<?php

global $config, $print;

$config = [
  "auth_all" => [
    "/action_calendrier.php",
    "/ajout_pp.php",
    "/ajouter.php",
    "/calendrier.php",
    "/editable_grid.php",
    "/fermer-session.php",
    "/fermer-session.php?PP=vider",
    "/form-login.php",
    "/head.php",
    "/header.php",
    "/index.php",
    "/inscription.php",
    "/page_mail.php",
    //'/saisir.php',
    "/tableauMedicaments.php",
    "/verif-login.php",
    "/verif-connect.php",
    "/config.php",
    "/ajax/pp.ajax.php",
    "/ajax/choixMedic.php",
    "/ajax/precautions.php",
    "/calendrier/",
    "/calendrier/print.php",
    "/plan/",
    "/plan/actions.php",
    "/plan/index.php",
    "/plan/print.php",
    "/plan/fonctions.php",
    "/plan/settings.php",
    "/plan/include.php",
    "/edit_profile.php",
  ],
  "infos" => [
    "url_site" => "plandeprise.fr",
    "mail" => "plandeprise@gmail.com",
    "titre" => "Plan de prise",
  ],
  "mysql" => [
    "sql_server" => env("DB_HOST"),
    "sql_database" => env("DB_DATABASE"),
    "sql_login" => env("DB_USERNAME"),
    "sql_password" => env("DB_PASSWORD"),
  ],
  "messages" => [
    "inactif" =>
      "Ce compte n'est pas actif. Vous recevrez un mail lors de l'activation du compte par un administrateur. ",
    "incomplet" =>
      "Merci de compléter tous les champs du formulaire avant de continuer. ",
  ],
];

$print = [
  "margin" => [
    "header-top" => 5,
    "header-bottom" => 5,
    "top" => 10 + 15 / 2,
    "bottom" => 10 + 10 / 2,
    "left" => 10,
    "right" => 10,
  ],
];

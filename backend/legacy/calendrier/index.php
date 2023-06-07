<?php global $_url, $toheader;

include_once LEGACY_PATH . "/calendrier/fonctions.php";
require_once LEGACY_PATH . "/connexion.php";

//Pre-process post
if (isset($_GET["id"])) {
  $id = $_GET["id"];
}
if (isset($_POST["id_cal"])) {
  $id = $_POST["id_cal"];
}
unset($_POST["id_cal"]);
if (isset($_POST["action"])) {
  $action = $_POST["action"];
}
unset($_POST["action"]);

if (isset($_POST["print"]) && isset($_POST["id"])) {
  $patient = filter_var($_POST["patient"], FILTER_SANITIZE_STRING);
  $type = filter_var($_POST["type"], FILTER_SANITIZE_STRING);
  calendar_print($_POST["id"], $type, $patient);
}

if (isset($_GET["delete"]) && isset($_GET["id"])) {
  calendar_delete($id);
  header("Location: /calendrier/");
}

//List calendars
if (!isset($id)) {
  $calendars = calendar_list();
  $id = array_key_exists(0, $calendars) ? $calendars[0]["id"] : null;
}

//Read database
$data = calendar_read($id);
if ($data == "new") {
  $new = true;
}

if (isset($action)) {
  if ($action == "Ajouter") {
    for ($k = 0; $k < count($_POST["nombre"]); $k++) {
      if ($_POST["id_medic"] == "3620194") {
        $erreur = [
          "level" => "warning",
          "text" => "Merci de compléter tous les champs. ",
        ];
        break;
      }
      if (empty($_POST["nombre"][$k])) {
        $_POST["nombre"][$k] = 1;
      }
      if (empty($_POST["frequence"][$k])) {
        $_POST["frequence"][$k] = 1;
      }
      if (empty($_POST["dates"][$k])) {
        $erreur = [
          "level" => "warning",
          "text" => "Merci de choisir une date dans le calendrier. ",
        ];
        break;
      }
    }
    //Valider les données
    if (!isset($erreur)) {
      if ($new) {
        $data = [];
      }
      //Empêcher doublons
      if (!$new) {
        foreach ($data as $donnees) {
          if ($donnees["id_medic"] == $_POST["id_medic"]) {
            $erreur = [
              "level" => "warning",
              "text" => "Ce médicament est déjà entré. ",
            ];
          }
        }
        unset($donnees);
      }
      //Forcer int pour nombre et fréquence
      foreach ($_POST["nombre"] as $key => $value) {
        $_POST["nombre"][$key] = intval($value);
      }
      foreach ($_POST["frequence"] as $key => $value) {
        $_POST["frequence"][$key] = intval($value);
      }
      if (!isset($erreur)) {
        if (!$new) {
          $data[] = $_POST;
          calendar_update($data, $id);
        } else {
          $data[] = $_POST;
          calendar_insert($data);
        }
      }
      if ($new == true) {
        $calendars = calendar_list();
        $id = end($calendars)["id"];
      }
    }
  } elseif ($action == "Modifier") {
    for ($k = 0; $k < count($_POST["nombre"]); $k++) {
      if (empty($_POST["nombre"][$k])) {
        $_POST["nombre"][$k] = 1;
      } elseif (empty($_POST["frequence"][$k])) {
        $_POST["frequence"][$k] = 1;
      }
    }
    foreach ($data as $key => $row) {
      if (array_key_exists("id_medic", $row) && $row["id_medic"] == $_POST["id_medic"]) {
        $data[$key] = $_POST;
        calendar_update($data, $id);
      }
    }
  }
}

if (isset($_POST["modifier"]) && !empty($_POST["modifier"])) {
  foreach ($data as $value) {
    if (array_key_exists("id_medic", $value) && $value["id_medic"] == $_POST["modifier"]) {
      $modifier = $value;
    }
  }
}

if (isset($_POST["supprimer"]) && !empty($_POST["supprimer"])) {
  foreach ($data as $key => $value) {
    if (array_key_exists("id_medic", $value) && $value["id_medic"] == $_POST["supprimer"]) {
      unset($data[$key]);
      calendar_update($data, $id);
    }
  }
  if (empty(calendar_read($id))) {
    calendar_delete($id);
    if (empty(calendar_list())) {
      $data = "new";
    }
  }
}

//List calendars
$calendars = calendar_list();
$head = "<select onChange='location = this.value' class='form-control'>";
if ($data == "new") {
  $head .= "<option>Nouveau calendrier de prise</option>";
}
foreach ($calendars as $key => $calendar) :
  $key++;
  $head .= "<option value='/calendrier/?id=" . $calendar["id"] . "'";
  if ($calendar["id"] == $id) {
    $head .= " selected='selected'";
  }
  $head .= ">Calendrier de prise " . $calendar["id"] . "</option>";
endforeach;
$head .= "</select>";
$toheader[] = $head;

if (count($calendars) > 0) {
  if ($id != "new") {
    $head = '<span class="btn-group" style="padding: 5px 0;">';
    $head .=
      '<a href="#print" data-toggle="modal"><span class="btn btn-round btn-xs btn-plain btn-warning" data-toggle="tooltip" title="Imprimer" data-placement="bottom"><span class="fa fa-print"></span></span></a>';
    $head .=
      '<a href="/calendrier/?delete&id=' .
      $id .
      '" id="delete" onClick="confirmation(event)"><span class="btn btn-round btn-xs btn-plain btn-danger" data-toggle="tooltip" title="Supprimer" data-placement="bottom"><span class="fa fa-times"></span></span></a>';
    $head .= "</span>";
    $toheader[] = $head;
  }
  $toheader[] =
    '<a href="' .
    $_url .
    '/calendrier/?id=new" style="padding: 5px 0;" data-toggle="tooltip" title="Nouveau calendrier" data-placement="bottom"><span class="btn btn-round btn-xs btn-plain btn-success"><span class="fa fa-plus"></span></span></a>';
}

$data = calendar_read($id);

if (isset($erreur) || $data != "new") {
  $recherche = [];
  if (isset($erreur)) {
    $recherche[] = $_POST["id_medic"];
  }
  if ($data != "new") {
    foreach ($data as $temp) {
      if (!array_key_exists("id_medic", $temp)) {
        continue;
      }
      $recherche[] = $temp["id_medic"];
    }
  }
  $query =
    "SELECT id, nomMedicament FROM medics_simple WHERE id IN ('" .
    implode("', '", $recherche) .
    "')";
  try {
    $sth = $dbh->query($query);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  foreach ($sth->fetchAll(PDO::FETCH_ASSOC) as $recherche) {
    $correspondance[$recherche["id"]] = $recherche["nomMedicament"];
    $correspondance["3620194"] = "Sélectionnez un médicament";
  }
}
?>
<html>

<head>
  <title>Calendrier</title>
  <?php include LEGACY_PATH . "/head.php"; ?>
  <link href="<?= $_url ?>/css/calendrier.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="<?= $_url ?>/js/datepicker/daterangepicker.min.css" />
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"></script>
  <script type="text/javascript" src="<?= $_url ?>/js/datepicker/jquery.daterangepicker.min.js"></script>
</head>

<body>
  <header><?php include LEGACY_PATH . "/header.php"; ?></header>
  <div id="print" class="modal" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row">
            <form method="POST" action="/calendrier/" target="_blank">
              <input type="hidden" name="print" />
              <input type="hidden" name="id" value="<?= $id ?>" />
              <div class="col-xs-12">
                <input type="text" class="form-control" name="patient" placeholder="Nom du patient" />
              </div>
              <div class="col-xs-12">
                <h4 class="text-center">Choisissez le style de calendrier : </h4>
              </div>
              <div class="col-xs-6">
                <button type="submit" class="print btn btn-primary" name="type" value="horizontal" style="height:auto;">
                  <img src="/img/icons/calendar_h.png" class="img-responsive" />
                </button>
              </div>
              <div class="col-xs-6">
                <button type="submit" class="print btn btn-primary" name="type" value="vertical" style="height:auto;">
                  <img src="/img/icons/calendar_v.png" class="img-responsive" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="table-responsive calendrier">
    <table class="table">
      <tr>
        <td>
          <div class="wrapper">
            <h4 class="text-center title add"><span class="glyphicon glyphicon-plus"></span> Ajouter un médicament</h4>
            <?php if (isset($erreur)) { ?>
              <div class="alert alert-xs alert-margin text-center alert-<?= $erreur["level"] ?>"><?= $erreur["text"] ?></div>
            <?php } ?>
            <form action="" method="POST" class="form-inline box-wrapper">
              <input type="hidden" name="id_cal" value="<?= $id ?>">
              <div class="row">
                <div class="form-group col-xs-12">
                  <select class="form-control" style="width:100%" name="id_medic" multiple="multiple">
                    <option>Sélectionnez un médicament</option>
                    <?php if (isset($erreur)) { ?>
                      <option value="<?= $_POST["id_medic"] ?>" selected="selected"><?php echo ctype_digit(
                                                                                      $_POST["id_medic"]
                                                                                    )
                                                                                      ? $correspondance[$_POST["id_medic"]]
                                                                                      : $_POST["id_medic"]; ?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
              <?php
              if (isset($_POST["ajouter"])) {
                $nb = count($_POST["nombre"]);
              } else {
                $nb = 1;
              }
              $datecount = 0;
              $javascript = "";
              for ($i = 0; $i < $nb; $i++) {

                if ($i != 0) {
                  echo "<hr/>";
                }
                $javascript .= "<script>initPicker(" . $datecount . ");</script>";
              ?>
                <div class="formulaire">
                  <div class="row">
                    <div class="form-group col-xs-12 unites">
                      <input id="nombre" name="nombre[]" type="text" min="0" class="form-control input-sm" <?php if (
                                                                                                              isset($erreur)
                                                                                                            ) {
                                                                                                              echo 'value="' . $_POST["nombre"][$i] . '"';
                                                                                                            } ?>>
                      <label> unité(s) de prise tous les </label>
                      <input id="frequence" name="frequence[]" type="text" min="1" class="form-control input-sm" <?php if (
                                                                                                                    isset($erreur)
                                                                                                                  ) {
                                                                                                                    echo 'value="' . $_POST["frequence"][$i] . '"';
                                                                                                                  } ?>>
                      <label> jours</label>
                      <a href="#" class="btn btn-round btn-xs btn-danger remove-period" data-toggle="tooltip" data-placement="left" title="Supprimer cette période"><span class="glyphicon glyphicon-remove"></span></a>
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-xs-12 periode">
                      <input name="dates[]" type="text" id="date<?= $i ?>" class="form-control input-sm hidden" <?php if (
                                                                                                                  isset($erreur)
                                                                                                                ) {
                                                                                                                  echo 'value="' . $_POST["dates"][$i] . '"';
                                                                                                                } ?>>
                      <div id="date_container<?= $datecount ?>" class="date_container date-success"></div>
                    </div>
                  </div>
                </div>
              <?php $datecount++;
              }
              ?>
              <div class="text-center">
                <a href="#" class="btn btn-round btn-xs btn-success add-period" data-style="success" data-toggle="tooltip" title="Ajouter une période"><span class="glyphicon glyphicon-plus"></span></a>
              </div>
              <div class="text-center action">
                <input type="submit" name="action" class="btn btn-round btn-success btn-lg" value="Ajouter">
              </div>
            </form>
          </div>
        </td>
        <?php if (isset($modifier)) { ?>
          <td>
            <div class="wrapper">
              <h4 class="text-center title modify"><span class="glyphicon glyphicon-edit"></span> Modifier <?php echo ctype_digit(
                                                                                                              $modifier["id_medic"]
                                                                                                            )
                                                                                                              ? $correspondance[$modifier["id_medic"]]
                                                                                                              : $modifier["id_medic"]; ?></h4>
              <?php if (isset($erreur)) { ?>
                <div class="alert alert-<?= $erreur["level"] ?>"><?= $erreur["text"] ?></div>
              <?php } ?>
              <form action="<?= $_SERVER["REQUEST_URI"] ?>" method="POST" class="form-inline box-wrapper">
                <input type="hidden" name="id_medic" value="<?= $modifier["id_medic"] ?>">
                <input type="hidden" name="id_cal" value="<?= $id ?>">
                <?php
                $nb = count($modifier["nombre"]);
                for ($i = 0; $i < $nb; $i++) {

                  if ($i != 0) {
                    echo "<hr/>";
                  }
                  $javascript .= "<script>initPicker(" . $datecount . ");</script>";
                ?>
                  <div class="formulaire">
                    <div class="row">
                      <div class="form-group col-xs-12 unites">
                        <input id="nombre" name="nombre[]" type="text" min="0" class="form-control input-sm" value="<?= $modifier["nombre"][$i] ?>">
                        <label> unité(s) de prise tous les </label>
                        <input id="frequence" name="frequence[]" type="text" min="1" class="form-control input-sm" value="<?= $modifier["frequence"][$i] ?>">
                        <label> jours</label>
                        <a href="#" class="btn btn-round btn-xs btn-danger remove-period" data-toggle="tooltip" data-placement="left" title="Supprimer cette période"><span class="glyphicon glyphicon-remove"></span></a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-xs-12 periode">
                        <input name="dates[]" type="text" id="date<?= $datecount ?>" class="form-control input-sm hidden" value="<?= $modifier["dates"][$i] ?>">
                        <div id="date_container<?= $datecount ?>" class="date_container date-warning"></div>
                      </div>
                    </div>
                  </div>
                <?php $datecount++;
                }
                ?>
                <div class="text-center">
                  <a href="#" class="btn btn-round btn-xs btn-warning add-period" data-style="warning" data-toggle="tooltip" title="Ajouter une période"><span class="glyphicon glyphicon-plus"></span></a>
                </div>
                <div class="text-center action">
                  <input type="submit" name="action" class="btn btn-round btn-warning btn-lg" value="Modifier">
                  <a href="<?= $_SERVER["REQUEST_URI"] ?>" class="btn btn-round btn-danger btn-lg">Annuler</a>
                </div>
              </form>
            </div>
          </td>
        <?php } ?>
        <?php if ($data != "new") {
          $data = array_reverse($data);
          foreach ($data as $entree) {
            if (!array_key_exists("id_medic", $entree)) {
              continue;
            }

            if (
              !isset($modifier) ||
              $modifier["id_medic"] != $entree["id_medic"]
            ) { ?>
              <td>
                <div class="wrapper">
                  <h4 class="text-center title"><?php echo ctype_digit($entree["id_medic"])
                                                  ? $correspondance[$entree["id_medic"]]
                                                  : $entree["id_medic"]; ?></h4>
                  <div class="box-wrapper">
                    <?php for ($i = 0; $i < count($entree["nombre"]); $i++) {
                      if ($i != 0) {
                        echo "<hr/>";
                      } ?>
                      <div class="row">
                        <div class="col-xs-12">
                          <p><?= $entree["nombre"][$i] ?> unité(s) de prise tous les <?= $entree["frequence"][$i] ?> jours</p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-xs-12">
                          <p>Du <?= $entree["dates"][$i] ?></p>
                        </div>
                      </div>
                    <?php
                    } ?>
                    <div class="text-center action">
                      <form action="" method="POST">
                        <input type="hidden" name="id_cal" value="<?= $id ?>">
                        <button type="submit" name="modifier" class="btn btn-round btn-warning btn-lg" value="<?= $entree["id_medic"] ?>"><span class="glyphicon glyphicon-edit"></span> Modifier</button>
                        <button type="submit" name="supprimer" class="btn btn-round btn-danger btn-lg" value="<?= $entree["id_medic"] ?>"><span class="glyphicon glyphicon-remove"></span> Supprimer</button>
                      </form>
                    </div>
                  </div>
                </div>
              </td>
        <?php }
          }
        } ?>
      </tr>
    </table>
  </div>
  <?php include_once LEGACY_PATH . "/footer.php"; ?>
  <div id="scroller">
    <button class="btn btn-default btn-round btn-xs transparent"><span class="glyphicon glyphicon-chevron-right"></span></button>
  </div>
  <script type="text/javascript" src="<?= $_url ?>/js/calendrier.js"></script>
  <?php if (isset($javascript)) {
    echo $javascript;
  } ?>
</body>

</html>
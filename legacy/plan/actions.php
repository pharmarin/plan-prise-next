<?php global $_url;

include_once LEGACY_PATH . "/plan/fonctions.php";
require_once LEGACY_PATH . "/connexion.php";

if (isset($_POST["add"])) {
  if (isset($_POST["id_medic"]) && !empty($_POST["id_medic"])) {
    if ($_POST["id_plan"] == "new") {
      echo plan_insert($_POST["id_medic"]);
    } else {
      echo plan_update($_POST["id_medic"], $_POST["id_plan"]);
    }
  }
} elseif (isset($_POST["update"])) {
  $id_plan = $_POST["id_plan"];
  $row = $_POST["row"];
  $type = $_POST["type"];
  $value = $_POST["value"];
  $value = strip_tags($value, "<br><a><b><u><i><sup><sub>");
  if (!mb_detect_encoding($value, "UTF-8", true)) {
    $value = utf8_encode($value);
  }
  $rang = $_POST["rang"] ?? null;
  $data = plan_read($id_plan);
  $plan = plan_array_edit($data, $row, $type, $value, $rang);
  debug($data, $id_plan);
  echo plan_update_row($plan, $id_plan);
} elseif (isset($_POST["option"])) {
  $key = $_POST["value"];
  $key = explode(",", $key);
  $type = $_POST["type"];
  $id_plan = $_POST["id_plan"];
  echo plan_update_option($type, $key, $id_plan);
} elseif (isset($_POST["remove"])) {
  $row = $_POST["row"];
  $id_plan = $_POST["id_plan"];
  echo plan_remove($row, $id_plan);
}
//echo '<br>';print_r($value);

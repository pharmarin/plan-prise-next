<?php

use Illuminate\Support\Facades\Auth;
use Mpdf\Mpdf;

require LEGACY_PATH . "/plan/settings.php";
require LEGACY_PATH . "/connexion.php";

//==== GENERAL
function plan_list()
{
  global $dbh;
  $sth = $dbh->prepare("SELECT id FROM plans_old WHERE user = ? ORDER BY id");
  try {
    $sth->execute([Auth::user()->old_user->login]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  return $sth->fetchAll(PDO::FETCH_ASSOC);
}

function plan_read($id = null)
{
  global $dbh;
  if (isset($id)) {
    $sth = $dbh->prepare(
      "SELECT id, data FROM plans_old WHERE id = ? && user = ?"
    );
    try {
      $sth->execute([$id, Auth::user()->old_user->login]);
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
  } else {
    $sth = $dbh->prepare("SELECT id, data FROM plans_old WHERE user = ?");
    try {
      $sth->execute([Auth::user()->old_user->login]);
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
  }

  $db = $sth->fetchall(PDO::FETCH_ASSOC);
  if (!$db) {
    $data["new"] = [];
    return $data;
  }
  foreach ($db as $db) {
    $data[$db["id"]] = json_decode($db["data"], true);
  }
  return $data[$id];
}

function plan_read_colonnes($data)
{
  $data_colonnes = [];

  foreach ($data as $row) {
    foreach ($row as $key => $value) {
      $data_colonnes[$key][] = $value;
    }
  }

  return $data_colonnes;
}

function plan_read_options($id)
{
  global $dbh, $default_settings;

  $sth = $dbh->prepare(
    "SELECT options FROM plans_old WHERE id = ? && user = ?"
  );
  $sth->execute([$id, Auth::user()->old_user->login]);
  $options = $sth->fetch(PDO::FETCH_ASSOC);
  $options = json_decode($options["options"] ?? "", true);

  foreach ($default_settings as $key => $value) {
    if (!isset($options[$key])) {
      $options[$key] = $value;
    }
  }
  return $options;
}

function plan_insert($id_medic)
{
  global $dbh;
  if (is_numeric($id_medic)) {
    $temp[] = plan_request($id_medic);
  } else {
    $temp[]["nomMedicament"] = $id_medic;
  }
  try {
    $sth = $dbh->prepare("INSERT INTO plans_old (user, data) VALUES (?, ?)");
    $sth->execute([Auth::user()->old_user->login, json_encode($temp)]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  $lastid = $dbh->lastInsertId();
  return json_encode(["status" => "success", "id" => $lastid]);
}

function plan_update($id_medic, $id_plan)
{
  global $dbh;
  $data = plan_read($id_plan);
  if (is_numeric($id_medic)) {
    foreach ($data as $row) {
      if ($row["id"] == $id_medic) {
        return json_encode([
          "status" => "present",
          "name" => $row["nomMedicament"],
        ]);
        break;
      }
    }
    $source = plan_request($id_medic);
    $data[] = plan_array_update($source);
  } else {
    $data[] = plan_array_update($id_medic);
  }
  try {
    $sth = $dbh->prepare(
      "UPDATE plans_old SET data = ? WHERE id = ? && user = ?"
    );
    $sth->execute([
      json_encode($data),
      $id_plan,
      Auth::user()->old_user->login,
    ]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  return json_encode(["status" => "success", "id" => $id_plan]);
}

function plan_remove($row, $id_plan)
{
  $data = plan_read($id_plan);
  unset($data[$row]);
  if (!empty($data)) {
    global $dbh;
    try {
      $sth = $dbh->prepare(
        "UPDATE plans_old SET data = ? WHERE id = ? && user = ?"
      );
      $sth->execute([
        json_encode($data),
        $id_plan,
        Auth::user()->old_user->login,
      ]);
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
  } else {
    plan_delete($id_plan);
  }
  return json_encode(["status" => "success"]);
}

function plan_update_row($data, $id_plan)
{
  global $dbh;
  try {
    $sth = $dbh->prepare(
      "UPDATE plans_old SET data = ? WHERE id = ? && user = ?"
    );
    $sth->execute([
      json_encode($data),
      $id_plan,
      Auth::user()->old_user->login,
    ]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  return json_encode(["status" => "success"]);
}

function plan_update_option($type, $key, $id_plan)
{
  if ($type == "poso") {
    global $dbh, $options, $cols;
    $options["poso"] = [];
    foreach ($key as $poso) {
      $options["poso"][$poso] = $cols[$poso];
    }
    try {
      $sth = $dbh->prepare(
        "UPDATE plans_old SET options = ? WHERE id = ? && user = ?"
      );
      $sth->execute([
        json_encode($options),
        $id_plan,
        Auth::user()->old_user->login,
      ]);
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
    return json_encode(["status" => "success"]);
  }
}

function plan_delete($id)
{
  global $dbh;
  try {
    $sth = $dbh->prepare("DELETE FROM plans_old WHERE id = ? AND user = ?");
    $sth->execute([$id, Auth::user()->old_user->login]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
}

function plan_print($id, $patient = "")
{
  ini_set("memory_limit", "128M");
  ini_set("max_execution_time", "60");
  include_once LEGACY_PATH . "/config.php";

  global $print;
  $options = plan_read_options($id);
  if (count($options["poso"]) > 2) {
    $mpdf = new Mpdf([
      "mode" => "UTF-8",
      "format" => "A4-L",
      "margin_left" => $print["margin"]["left"],
      "margin_right" => $print["margin"]["right"],
      "margin_top" => $print["margin"]["top"],
      "margin_bottom" => $print["margin"]["bottom"],
      "margin_header" => $print["margin"]["header-top"],
      "margin_footer" => $print["margin"]["header-bottom"],
    ]);
  } else {
    $mpdf = new Mpdf([
      "mode" => "UTF-8",
      "format" => "A4-L",
      "margin_left" => $print["margin"]["left"],
      "margin_right" => $print["margin"]["right"],
      "margin_top" => $print["margin"]["top"],
      "margin_bottom" => $print["margin"]["bottom"],
      "margin_header" => $print["margin"]["header-top"],
      "margin_footer" => $print["margin"]["header-bottom"],
    ]);
  }
  $mpdf->debug = true;
  $mpdf->SetDisplayMode("fullpage");
  $mpdf->SetHTMLHeader(
    '
		<table width="100%" style="font-weight: bold;"><tr>
			<td width="66%"><p>Un plan pour vous aider à mieux prendre vos médicaments</p><p>Ceci n\'est pas une ordonnance. </p></td>
			<td width="33%" style="text-align: right;">' .
      $patient .
      '</td>
		</tr></table>
	'
  );
  $mpdf->SetHTMLFooter(
    '
		<table width="100%" style="vertical-align: center; font-size: 8pt; font-weight: bold;"><tr>
			<td width="33%"><span>Créé par ' .
      ucwords(strtolower(Auth::user()->display_name)) .
      ' le {DATE j/m/Y}</span></td>
			<td width="33%" style="text-align: center;"><span>Plan n°' .
      $id .
      '</span></td>
			<td width="33%" style="text-align: right;">Page {PAGENO} sur {nbpg}</td>
		</tr></table>
	'
  );
  $toprintid = $id;
  ob_start();
  require "print.php";
  $html = ob_get_contents();
  ob_end_clean();
  $mpdf->WriteHTML($html);
  if (!empty($patient)) {
    $patient = " (" . $patient . ")";
  }
  $mpdf->Output("Plan #" . $id . $patient . ".pdf", "I");
  exit();
}

function plan_request($id)
{
  global $dbh;
  try {
    $sth = $dbh->prepare("SELECT * FROM medics_simple WHERE id = ?");
    $sth->execute([$id]);
    $source = $sth->fetch(PDO::FETCH_ASSOC);
    unset(
      $source["modifie"],
      $source["qui"],
      $source["relecture"],
      $source["stat"]
    );
    $source["commentaire"] = plan_decode($source["commentaire"]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  return $source;
}

function plan_array_update($row, $poso = ["matin", "midi", "soir"])
{
  if (!is_array($row)) {
    $row = preg_replace_callback(
      "/^([\D]*)? ?[\d]*?.*?/",
      function ($matches) {
        return strtoupper($matches[0]);
      },
      $row
    );
    $row = ["nomMedicament" => $row];
  }
  $default = [
    "nomMedicament",
    "nomGenerique",
    "indication",
    "voieAdministration",
    "frigo",
    "dureeConservation",
    "commentaire",
    "commentairePerso",
    "options",
  ];
  foreach ($poso as $poso) {
    $default[] = $poso;
  }
  foreach ($default as $key) {
    if (!array_key_exists($key, $row)) {
      $row[$key] = "";
    }
  }
  return $row;
}

function plan_array_edit($plan, $row, $item, $value, $rang = null)
{
  switch ($item) {
    case "text":
    case "span":
    case "status":
      $plan[$row]["commentaire"][$rang][$item] = $value;
      break;
    default:
      $plan[$row][$item] = $value;
  }
  return $plan;
}

function plan_print_data($key, $type, $rang = null)
{
  $data_rang = "";

  if (isset($rang)) {
    $data_rang = ' data-rang="' . $rang . '"';
  }

  $return = 'data-row="' . $key . '" data-type="' . $type . '"' . $data_rang;
  return $return;
}

//==== INDICATION
function plan_preprocess_indication($data)
{
  $test = explode(" OU ", $data);
  if (is_array($test)) {
    return $test;
  } else {
    return $data;
  }
}

function plan_preprocess_conservation($data)
{
  if (json_decode($data)) {
    return json_decode($data, true);
  } else {
    return $data;
  }
}

//==== CONSERVATION
function plan_empty_col($value, $id)
{
  global $data_colonnes;
  $val = array_filter($data_colonnes[$value]);
  if (!empty($val)) {
    return false;
  } else {
    return true;
  }
}

//==== COMMENTAIRES
function plan_decode($commentaire)
{
  if (!json_decode($commentaire)) {
    return json_decode(stripslashes($commentaire), true);
  } else {
    return json_decode($commentaire, true);
  }
}

function plan_precautions($printable = false)
{
  $col = 12;
  $coloffset = (12 - $col) / 2;
  global $data_colonnes, $dbh;
  $prec = array_values(
    array_unique(array_filter($data_colonnes["precaution"]))
  );
  if (count($prec) == 0) {
    return;
  }
  $print = '<div class="row">';
  for ($i = 0; $i < count($prec); $i++) {
    if ($i != 0) {
      $print .= "</div>";
      if ($i % 2 == 0) {
        $print .= '</div><div class="row">';
      }
    }
    if ($printable) {
      $style = 'style="page-break-inside:avoid;"';
    } else {
      $style = "";
    }
    if ($i % 2 == 0 && $i == count($prec) - 1) {
      $print .=
        '<div class="col-xs-' .
        $col .
        " col-xs-offset-" .
        $coloffset .
        '" ' .
        $style .
        ">";
    } else {
      $print .= '<div class="col-xs-' . $col . '" ' . $style . ">";
    }
    $sth = $dbh->query(
      "SELECT * FROM precautions WHERE mot_cle = '" . $prec[$i] . "'"
    );
    $resultat = $sth->fetch(PDO::FETCH_ASSOC);
    $titre = $resultat["titre"];
    $contenu = $resultat["contenu"];
    $couleur = $resultat["couleur"];
    $print .= '<div class="panel panel-warning" style="border-color:#e7e7e7;">';
    if ($printable) {
      $print .=
        '<div class="panel-heading" style="background-color:' .
        $couleur .
        ';color:white;border-color:#e7e7e7;">' .
        $titre .
        "</div>";
      $print .= '<div class="panel-body">' . $contenu . "</div>";
    } else {
      $print .=
        '<div class="panel-heading" style="background-color:' .
        $couleur .
        ';color:white;border-color:#e7e7e7">' .
        $titre .
        "</div>";
      $print .= '<div class="panel-body">' . $contenu . "</div>";
    }
    $print .= "</div>";
  }
  $print .= "</div>";
  return $print;
}

function validate_utf8($str)
{
  $decoded = utf8_encode($str);
  if (mb_detect_encoding($decoded, "UTF-8", true) === true) {
    return $str;
  }
  return $decoded;
}

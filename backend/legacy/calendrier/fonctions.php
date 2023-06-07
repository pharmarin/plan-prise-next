<?php

use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\Auth;
use Mpdf\Mpdf;

require_once LEGACY_PATH . "/connexion.php";

function calendar_list()
{
  global $dbh, $racine;
  if (!is_object($dbh)) {
    require_once LEGACY_PATH . "/connexion.php";
  }
  $sth = $dbh->prepare("SELECT id FROM calendriers_old WHERE user = ?");
  try {
    $sth->execute([Auth::user()->id]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  return $sth->fetchAll(PDO::FETCH_ASSOC);
}

function calendar_read($id = null)
{
  global $dbh;

  if (isset($id)) {
    $query =
      "SELECT id, data FROM calendriers_old WHERE id = '" .
      $id .
      "' AND user = '" .
      Auth::user()->id .
      "'";
  } else {
    $query =
      "SELECT id, data FROM calendriers_old WHERE user = '" .
      Auth::user()->id .
      "'";
  }

  try {
    $sth = $dbh->query($query);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }

  $db = $sth->fetchall(PDO::FETCH_ASSOC);

  if (!$db) {
    $data = "new";
    return $data;
  }

  foreach ($db as $calendar) {
    $data[$calendar["id"]] = json_decode($calendar["data"], true);
  }

  if (isset($id)) {
    return $data[$id];
  } else {
    return $data;
  }
}

function calendar_update($post, $id)
{
  global $dbh;
  $query =
    "UPDATE calendriers_old SET data = '" .
    json_encode($post) .
    "' WHERE user = '" .
    Auth::user()->id .
    "' AND id = '" .
    $id .
    "'";
  try {
    $dbh->exec($query);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
}

function calendar_insert($post)
{
  global $dbh;
  $query =
    "INSERT INTO calendriers_old (user, data) VALUES ('" .
    Auth::user()->id .
    "', '" .
    json_encode($post) .
    "')";
  try {
    $dbh->exec($query);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
}

function calendar_delete($id)
{
  global $dbh;
  try {
    $sth = $dbh->prepare("DELETE FROM calendriers_old WHERE id = ? AND user = ?");
    $sth->execute([$id, Auth::user()->id]);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
}

function calendar_print($id, $type = "horizontal", $patient = "")
{
  ini_set("memory_limit", "128M");
  ini_set("max_execution_time", "60");

  include_once LEGACY_PATH . "/config.php";

  global $print;

  if ($type == "vertical") {
    $mpdf = new Mpdf([
      "mode" => "UTF-8",
      "format" => "A4-P",
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
  $mpdf->SetHTMLHeader(
    '
		<table width="100%" style="vertical-align: center; font-weight: bold;"><tr>
			<td width="66%"><p>Un calendrier pour vous aider à mieux prendre vos médicaments</p><p>Ceci n\'est pas une ordonnance. </p></td>
			<td width="33%" style="text-align:right;">' .
      $patient .
      '</td>
		</tr></table>
	'
  );
  $mpdf->SetHTMLFooter(
    '
		<table width="100%" style="vertical-align: center; font-size: 8pt; font-weight: bold;"><tr>
			<td width="33%"><span>Créé par ' .
      ucwords(strtolower(Auth::user()->displayName ?? Auth::user()->firstName . " " . Auth::user()->lastName)) .
      ' le {DATE j/m/Y}</span></td>
			<td width="33%" style="text-align: center;"><span>Calendrier n°' .
      $id .
      '</span></td>
			<td width="33%" style="text-align: right;">Page {PAGENO} sur {nbpg}</td>
		</tr></table>
	'
  );

  ob_start();
  require "print.php";
  $html = ob_get_contents();
  ob_end_clean();
  $mpdf->WriteHTML($html);
  if (!empty($patient)) {
    $patient = " (" . $patient . ")";
  }
  $mpdf->Output("Calendrier #" . $id . $patient . ".pdf", "I");
  exit();
}

function calendar_request($id)
{
  global $dbh;
  $query =
    "SELECT nomMedicament, nomGenerique FROM medics_simple WHERE id = '" .
    $id .
    "'";
  try {
    $sth = $dbh->query($query);
    $source = $sth->fetch(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    echo $e->getMessage();
  }
  return $source;
}

/* https://davidwalsh.name/php-event-calendar */

/* draws a calendar */
function calendar_draw_vertical($month, $year, $events = [])
{
  $color = [
    "003366",
    "663333",
    "336666",
    "660066",
    "006600",
    "666666",
    "FF0000",
    "000000",
  ];
  global $listmedic;
  if (!$listmedic) {
    $listmedic = [];
  }

  /* table headings */
  setlocale(LC_TIME, "fr_FR");
  $calendar =
    '<div class="calendar-month-head" style="text-align:center;margin-top:0;">' .
    ucwords(utf8_encode(strftime("%B", mktime(0, 0, 0, $month, 1, $year)))) .
    " " .
    strftime("%Y", mktime(0, 0, 0, $month, 1, $year)) .
    "</div>";

  /* draw table */
  $calendar .=
    '<table class="table table-bordered vertical" cellpadding="8" style="color: black; border-color: black; margin-bottom:0;">';

  /* days and weeks vars now ... */
  $running_day = date("w", mktime(0, 0, 0, $month, 0, $year));
  $days_in_month = date("t", mktime(0, 0, 0, $month, 1, $year));
  $days_in_this_week = 1;
  $day_counter = 0;
  $dates_array = [];

  $calendar .= "<tbody>";

  /* keep going with days.... */
  for ($list_day = 1; $list_day <= $days_in_month; $list_day++) :
    $calendar .= "<tr>";

    /* add in the day number */
    $calendar .=
      '<td class="day-number" style="text-align: center; width: 7mm; height: 7mm; border-color: black;">' .
      $list_day .
      "</td>";

    $jour_semaine =
      strftime("%u", mktime(0, 0, 0, $month, $list_day, $year)) - 1;
    $liste_jours = ["L", "M", "M", "J", "V", "S", "D"];
    $calendar .=
      '<td class="day-letter" style="text-align:center; width: 7mm; height: 7mm; border-color: black;">' .
      $liste_jours[$jour_semaine] .
      "</td>";
    $calendar .= '<td style="border-color: black;">';

    $event_day = $year . "-" . $month . "-" . $list_day;

    if (isset($events[$event_day])) {
      $nbevent = 0;
      foreach ($events[$event_day] as $event) {
        $nbevent++;
        if (!array_key_exists($event["id_medic"], $listmedic)) {
          $listmedic[$event["id_medic"]] = $color[count($listmedic)];
        }
        if (ctype_digit($event["id_medic"])) {
          $medic = calendar_request($event["id_medic"]);
          $title = $medic["nomMedicament"];
        } else {
          $title = $event["id_medic"];
        }
        $titre =
          ' <img src="/calendrier/image.php?color=' .
          $listmedic[$event["id_medic"]] .
          '" style="margin: 1mm;"> ' .
          $event["nombre"] .
          " x " .
          $title;
        //$titre = ' <img src="image.php?color=000000" style="margin: 1mm;"> '.$event['nombre'].' x '.$medic['nomMedicament'];
        $calendar .= '<div class="event">' . $titre . "</div>";
        //$calendar.= '<div class="event">'.$titre.'</div>';
      }
    }

    $calendar .= "</td></tr>";
    $days_in_this_week++;
    $running_day++;
    $day_counter++;
  endfor;
  /* finish the rest of the days in the week */

  /* final row */
  $calendar .= "</tbody>";

  /* end the table */
  $calendar .= "</table>";

  /** DEBUG **/
  $calendar = str_replace("</td>", "</td>" . "\n", $calendar);
  $calendar = str_replace("</tr>", "</tr>" . "\n", $calendar);

  /* all done, return result */
  return $calendar;
}

function calendar_draw_horizontal($month, $year, $events = [])
{
  $color = [
    "003366",
    "663333",
    "336666",
    "660066",
    "006600",
    "666666",
    "FF0000",
    "000000",
  ];
  global $listmedic;
  if (!$listmedic) {
    $listmedic = [];
  }

  /* draw table */
  setlocale(LC_TIME, "fr_FR");
  $calendar =
    '<div class="calendar-month-head" style="text-align:center; margin-top: 0;page-break-after:avoid;">' .
    ucwords(utf8_encode(strftime("%B", mktime(0, 0, 0, $month, 1, $year)))) .
    " " .
    strftime("%Y", mktime(0, 0, 0, $month, 1, $year)) .
    "</div>";

  /* table headings */
  $liste_jours = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  $nb_days = cal_days_in_month(CAL_GREGORIAN, $month, $year);
  $first_day = new DateTime("$year-$month-01");
  $first_day_in_week = $first_day->format('N');
  $width = 7 / 100;

  $document = new DOMDocument();

  $calendar_table = $document->createElement('table');
  $calendar_table->setAttribute("class", "table table-bordered horizontal");
  $calendar_table->setAttribute("cellpadding", 8);
  $calendar_table->setAttribute("style", "border-color: black; font-size: 80%; margin-bottom:0;");
  $document->appendChild($calendar_table);

  $tr = $document->createElement('tr');
  $calendar_table->appendChild($tr);

  foreach ($liste_jours as $week_day) {
    $th = $document->createElement('th', $week_day);
    $th->setAttribute("style", "border-color:black; text-align: center; width: {$width}%; padding: 1mm; font-size: 110%;");
    $th->setAttribute("class", "calendar-day-head");
    $tr->appendChild($th);
  }

  for ($semaine = 1; $semaine <= ceil($nb_days / 7); $semaine++) {
    $tr = $document->createElement('tr');
    $calendar_table->appendChild($tr);

    // boucle pour afficher les jours de la semaine
    for ($day = 1; $day <= 7; $day++) {
      $jour_calendrier = ($semaine - 1) * 7 + $day - $first_day_in_week + 1;
      $event_day = $year . "-" . $month . "-" . $jour_calendrier;

      $td = $document->createElement('td');
      $td->setAttribute("style", "border-color:black;vertical-align: top;height: 100px;padding:1mm;");

      $day_number = $document->createElement('div', $jour_calendrier);
      $day_number->setAttribute("style", "font-weight: bold;margin-left: 1mm;");
      $day_number->setAttribute("class", "day-number");
      $td->appendChild($day_number);

      if (isset($events[$event_day])) {
        foreach ($events[$event_day] as $event) {
          if (!array_key_exists($event["id_medic"], $listmedic)) {
            $listmedic[$event["id_medic"]] = $color[count($listmedic)];
          }

          if (ctype_digit($event["id_medic"])) {
            $medic = calendar_request($event["id_medic"]);
            $title = $medic["nomMedicament"];
          } else {
            $title = $event["id_medic"];
          }

          $event_div = $document->createElement("div");
          $event_div->setAttribute("class", "event");
          $td->appendChild($event_div);

          $image = $document->createElement("img");
          $image->setAttribute("src", "/calendrier/image.php?color={$listmedic[$event['id_medic']]}");
          $image->setAttribute("style", "margin: 1mm;");

          $event_title = $document->createElement("span", $event["nombre"] .
            " x " .
            preg_replace("/[ ]+(?=\D)/", "&nbsp;", $title));

          $event_div->append($image, $event_title);
        }
      }

      if ($jour_calendrier < 1 || $jour_calendrier > $nb_days) {
        $td->nodeValue = '';
        $td->setAttribute("class", "calendar-day-np");
      } else {
        $td->setAttribute("class", "calendar-day");
      }

      $tr->appendChild($td);
    }
  }

  return $calendar . $document->saveHTML();
}

function diff_en_mois_entre_deux_date($start, $end)
{
  //$date_format = Y-m-d
  sscanf($start, "%4s-%2s-%2s", $annee, $mois, $jour);
  $a1 = $annee;
  $m1 = $mois;
  sscanf($end, "%4s-%2s-%2s", $annee, $mois, $jour);
  $a2 = $annee;
  $m2 = $mois;

  $dif_en_mois = $m2 - $m1 + 12 * ($a2 - $a1);
  return $dif_en_mois;
}

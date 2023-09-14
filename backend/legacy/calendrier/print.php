<?php

include_once LEGACY_PATH . "/calendrier/fonctions.php";

global $_url;
if (isset($_REQUEST["id"])) {
  $toprintid = $_REQUEST["id"];
}
if (isset($_REQUEST["type"])) {
  $type = $_REQUEST["type"];
}
if (isset($toprintid)) {
  $id = $toprintid;
} else {
  echo utf8_decode(
    "Quelque chose n'a pas fonctionné, merci de réessayer ! <pre>"
  );
  exit();
}

$data = calendar_read($id);
$first = true; //$date_min = time();
$date_max = strtotime("01-01-1970");

foreach ($data as $key => $row) {
  foreach ($row["dates"] as $num => $dates) {
    $explode = explode(" au ", $dates);
    foreach ($explode as $date_key => $date_value) {
      $temp = strtotime(str_replace("/", "-", $date_value));
      $explode[$date_key] = date("Y-m-d", $temp);
      if ($first) {
        $date_min = $temp;
        $first = false;
      } elseif ($temp < $date_min) {
        $date_min = $temp;
      }
      if ($temp > $date_max) {
        $date_max = $temp;
      }
    }
    $data[$key]["dates"][$num] = $explode;

    $start = new DateTime($data[$key]["dates"][$num][0]);
    $end = new DateTime($data[$key]["dates"][$num][1]);
    $end = $end->modify("+1 day");
    $interval = new DateInterval("P" . $data[$key]["frequence"][$num] . "D");
    $period = new DatePeriod($start, $interval, $end);
    foreach ($period as $date) {
      $events[$date->format("Y-n-j")][] = [
        "id_medic" => $data[$key]["id_medic"],
        "nombre" => $data[$key]["nombre"][$num],
      ];
    }
  }
}
$date_min = date("Y-m-d", $date_min);
$date_max = date("Y-m-d", $date_max);
$nombre_mois = diff_en_mois_entre_deux_date($date_min, $date_max);
?>
<html>

<body>
  <div class="container">
    <?php
    sscanf($date_min, "%4s-%2s-%2s", $annee, $mois, $jour);
    $mois = (int) $mois;
    if ($type == "vertical") : ?>
      <div class="row">
        <?php for ($k = 0; $k <= $nombre_mois; $k++) {
          if ($k % 2 == 0 && $k != 0) {
            echo "</div><pagebreak/><div class='row'>";
          } ?>
          <div class="col-xs-6" style="width:45%">
            <?php
            echo calendar_draw_vertical($mois, $annee, $events);
            $mois++;
            if ($mois == 13) {
              $mois = 1;
              $annee++;
            }
            ?>
          </div>
        <?php
        } ?>
      </div>
      <?php elseif ($type == "horizontal") :
      for ($k = 0; $k <= $nombre_mois; $k++) { ?>
        <div class="row">
          <div class="col-xs-12 <?= $k ?>">
            <?php
            echo calendar_draw_horizontal($mois, $annee, $events);
            $mois++;
            if ($mois == 13) {
              $mois = 1;
              $annee++;
            }
            ?>
          </div>
        </div>
        <pagebreak />
    <?php }
    endif;
    ?>
  </div>
</body>

</html>
<?php

use Illuminate\Support\Facades\Auth;

class plandeprise
{
  private $nom_PP;
  private $list_table;
  private $exists;
  private $contenu;
  private $colonnes;
  private $listMedic;
  private $listCol;
  private $last;

  public function __construct()
  {
    $this->nom_PP = "PP_" . Auth::user()->old_user->login;
  }

  public function prepare()
  {
    require LEGACY_PATH . "/connexion.php";
    $query =
      "SHOW TABLES FROM " . $sql_database . " LIKE '" . $this->nom_PP . "'";
    $sth = $dbh->query($query);
    $this->list_table = $sth->fetchall(PDO::FETCH_ASSOC);
    if ($this->tableExists() == 1) {
      $query = "SELECT * FROM " . $this->nom_PP . " ORDER BY id";
      $sth = $dbh->query($query);
      $this->contenu = $sth->fetchAll(PDO::FETCH_ASSOC);

      for ($i = 0; $i < $sth->rowCount(); $i++) {
        foreach ($this->contenu[$i] as $key => $value) {
          $this->colonnes[$key][] = $value;
        }
      }

      return $this->contenu;
    }
  }

  public function prepareModif()
  {
    require LEGACY_PATH . "/connexion.php";
    $query = "SHOW TABLES FROM $sql_database LIKE '" . $this->nom_PP . "'";
    $sth = $dbh->query($query);
    $this->list_table = $sth->fetchall(PDO::FETCH_ASSOC);
  }

  public function listCol()
  {
    require LEGACY_PATH . "/connexion.php";
    $query = "SELECT * FROM " . $this->nom_PP;
    $sth = $dbh->query($query);
    $this->listMedic = $sth->fetchall(PDO::FETCH_ASSOC);

    for ($i = 0; $i < $sth->rowCount(); $i++) {
      foreach ($this->listMedic[$i] as $key => $value) {
        $this->listCol[$key][] = $value;
      }
    }

    return $this->listCol;
  }

  public function coucher()
  {
    require LEGACY_PATH . "/connexion.php";
    $query =
      'SELECT PPcoucher FROM users WHERE login="' .
      Auth::user()->old_user->login .
      '"';
    $sth = $dbh->query($query);
    $coucher = $sth->fetch(PDO::FETCH_ASSOC);
    return $coucher["PPcoucher"];
  }

  public function create()
  {
    require LEGACY_PATH . "/connexion.php";
    $table = $this->tableExists();
    if ($table != 1) {
      $query =
        "CREATE TABLE IF NOT EXISTS `" .
        $this->nom_PP .
        "` (
			  `id` int(11) NOT NULL AUTO_INCREMENT,
			  `idMedic` int(11) DEFAULT NULL,
			  `nomMedicament` varchar(50) DEFAULT NULL,
			  `nomGenerique` varchar(50) DEFAULT NULL,
			  `indication` text,
			  `frigo` tinyint(1) NOT NULL DEFAULT '0',
			  `dureeConservation` text,
			  `voieAdministration` varchar(50) DEFAULT NULL,
			  `matin` varchar(100) DEFAULT NULL,
			  `midi` varchar(100) DEFAULT NULL,
			  `soir` varchar(100) DEFAULT NULL,
			  `coucher` varchar(100) DEFAULT NULL,
			  `fusion` varchar(100) DEFAULT NULL,
			  `commentaire` text,
			  `commentairePerso` text,
			  `modifie` varchar(20) DEFAULT NULL,
			  `precaution` varchar(50) DEFAULT NULL,
			  `options` varchar(50) DEFAULT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1";

      $dbh->exec($query);
      //echo $query;
    }
  }

  public function ajout($id)
  {
    require LEGACY_PATH . "/connexion.php";
    if (
      count($this->listCol["idMedic"]) == 1 &&
      $this->listCol["idMedic"][0] == $id
    ) {
      $key = array_search($id, $this->colonnes["idMedic"]);
      $nom = $this->colonnes["nomMedicament"][$key];
      return json_encode(["error" => "present", "nom" => $nom]);
    } elseif (
      count($this->listCol["idMedic"]) > 1 &&
      in_array($id, $this->listCol["idMedic"])
    ) {
      $key = array_search($id, $this->colonnes["idMedic"]);
      $nom = $this->colonnes["nomMedicament"][$key];
      return json_encode(["error" => "present", "nom" => $nom]);
    }
    try {
      $query =
        "INSERT INTO " .
        $this->nom_PP .
        " (idMedic, nomMedicament, nomGenerique, frigo, dureeConservation, indication, voieAdministration, matin, midi, soir, commentaire, precaution)
			SELECT id, nomMedicament, nomGenerique, frigo, dureeConservation, indication, voieAdministration, matin, midi, soir, commentaire, precaution
			FROM medics_simple WHERE id='" .
        $id .
        "'";
      $dbh->exec($query);
      $this->last = $dbh->lastInsertId();
      $this->statistiques($id);
    } catch (PDOException $e) {
      echo "Échec lors de la connexion : " . $e->getMessage();
    }
    return json_encode(["error" => "success"]);
  }

  public function supprime($id)
  {
    require LEGACY_PATH . "/connexion.php";
    $query = "DELETE FROM " . $this->nom_PP . " WHERE idMedic='" . $id . "'";
    $dbh->exec($query);
    $query = "SELECT * FROM " . $this->nom_PP . " ORDER BY id";
    $sth = $dbh->query($query);
    if ($sth->rowCount() == 0) {
      $query = "DROP TABLE " . $this->nom_PP;
      $sth = $dbh->exec($query);
    }
    return "success";
  }

  public function resize($id)
  {
    require LEGACY_PATH . "/connexion.php";
    $query =
      "SELECT options FROM " . $this->nom_PP . " WHERE idMedic='" . $id . "'";
    $sth = $dbh->query($query);
    if ($sth->rowCount() > 0) {
      $result = $sth->fetch();
      if ($result["options"] == "fusion") {
        $query =
          "UPDATE " .
          $this->nom_PP .
          " SET options = '' WHERE idMedic='" .
          $id .
          "'";
        $dbh->exec($query);
      } else {
        $query =
          "UPDATE " .
          $this->nom_PP .
          " SET options = 'fusion' WHERE idMedic='" .
          $id .
          "'";
        $dbh->exec($query);
      }
      return "success";
    }
  }

  public function result($id)
  {
    require LEGACY_PATH . "/connexion.php";
    $query = "SELECT * FROM medics_simple WHERE id='" . $id . "'";
    $sth = $dbh->query($query);
    $result = $sth->fetch();

    if (strpos($result["indication"], "OU") > 0) {
      $indication = explode(" OU ", $result["indication"]);
      $indic_multi = [];
      foreach ($indication as $key) {
        $indic_multi[$key] = $key;
      }
      $indic_multi = json_encode($indic_multi);
    } else {
      $indic_multi = $result["indication"];
    }

    return [
      "id" => $id,
      "idPP" => $this->last,
      "nomMedicament" => $result["nomMedicament"],
      "nomGenerique" => $result["nomGenerique"],
      "indication" => $indic_multi,
      "frigo" => $result["frigo"],
      "dureeConservation" => $result["dureeConservation"],
      "voieAdministration" => $result["voieAdministration"],
      "commentaire" => $result["commentaire"],
      "precaution" => $result["precaution"],
    ];
  }

  public function tableExists()
  {
    foreach ($this->list_table as $value) {
      if (in_array($this->nom_PP, $value)) {
        return 1;
      }
    }
  }

  public function conservation($value)
  {
    $val = array_filter($this->colonnes[$value]);
    if (!empty($val)) {
      return 1;
    }
  }

  public function draw_precaution($titre, $contenu, $couleur)
  {
    $precaution =
      '<div class="panel panel-warning" style="border-color:#e7e7e7">';
    $precaution .=
      '<div class="panel-heading" style="background-color:' .
      $couleur .
      ';color:white;border-color:#e7e7e7">' .
      $titre .
      "</div>";
    $precaution .= '<div class="panel-body">' . $contenu . "</div>";
    $precaution .= "</div>";
    return $precaution;
  }

  private function array_empty($array)
  {
    $is_empty = true;
    foreach ($array as $k) {
      $is_empty = $is_empty && empty($k);
    }
    return $is_empty;
  }

  public function precaution($col = 6)
  {
    $coloffset = (12 - $col) / 2;
    if (count($this->colonnes["precaution"]) > 0) {
      require LEGACY_PATH . "/connexion.php";
      $prec = array_unique(array_filter($this->colonnes["precaution"]));
      $nb_prec = count($prec);
      $prec = array_filter($prec);
      if (in_array("valproate", $prec)) {
        $nb_prec - 1;
      }
      if ($nb_prec >= 1) {
        $print = '<div class="row">';
        $i = 0;
        foreach ($prec as $value) {
          if ($value !== "valproate") {
            if ($i != 0) {
              $print .= "</div>";
              if ($i % 2 == 0) {
                $print .= '</div><div class="row">';
              }
            }
            if ($i % 2 == 0 && $i == $nb_prec - 1) {
              $print .=
                '<div class="col-xs-' .
                $col .
                " col-xs-offset-" .
                $coloffset .
                '">';
            } else {
              $print .= '<div class="col-xs-' . $col . '">';
            }
            $query = "SELECT * FROM precautions WHERE mot_cle = '$value'";
            $sth = $dbh->query($query);
            $resultat = $sth->fetchall(PDO::FETCH_ASSOC);
            $titre = $resultat[0]["titre"];
            $contenu = $resultat[0]["contenu"];
            $couleur = $resultat[0]["couleur"];
            $print .= $this->draw_precaution($titre, $contenu, $couleur);
            $i++;
          }
        }
        $print .= "</div>";
      }
      return $print;
    }
  }

  public function precautionJSON()
  {
    require LEGACY_PATH . "/connexion.php";
    $query = "SELECT mot_cle FROM precautions";
    $sth = $dbh->query($query);
    $resultat = $sth->fetchall(PDO::FETCH_COLUMN);
    for ($i = 0; $i < $sth->rowCount(); $i++) {
      $json .=
        "<option value='" . $resultat[$i] . "'>" . $resultat[$i] . "</option>";
    }
    return $json;
  }

  public function commentaire($id, $rang, $status)
  {
    //print_r ($_GET);
    require LEGACY_PATH . "/connexion.php";
    $query =
      "SELECT commentaire FROM " . $this->nom_PP . " WHERE idMedic = " . $id;
    $sth = $dbh->query($query);
    $commentaire = $sth->fetchAll(PDO::FETCH_COLUMN);
    $commentaire = json_decode(stripslashes($commentaire[0]), true);
    $commentaire[$rang]["status"] = $status;
    for ($i = 0; $i < count($commentaire); $i++) {
      $commentaire[$i]["text"] = addslashes($commentaire[$i]["text"]);
    }
    $commentaire = json_encode($commentaire, JSON_UNESCAPED_UNICODE);
    $commentaire = str_replace("\\\\", "\\", $commentaire);
    $query =
      "UPDATE " .
      $this->nom_PP .
      " SET commentaire = '" .
      $commentaire .
      "' WHERE idMedic = " .
      $id;
    $dbh->exec($query);
    return $query;
  }

  public function modifComment($id, $rang, $comment)
  {
    //return $comment;
    require LEGACY_PATH . "/connexion.php";
    require LEGACY_PATH . "/plan/fonctions.php";
    $query =
      "SELECT commentaire FROM " . $this->nom_PP . " WHERE idMedic = " . $id;
    $sth = $dbh->query($query);
    $commentaire = $sth->fetchAll(PDO::FETCH_COLUMN);
    $commentaire = comments_decode($commentaire[0]);
    $commentaire[$rang]["text"] = $comment;
    $commentaire = comments_encode($commentaire);
    $query =
      "UPDATE " .
      $this->nom_PP .
      " SET commentaire = '" .
      $commentaire .
      "' WHERE idMedic = " .
      $id;
    $dbh->exec($query);
    return $query;
  }

  public function setconservation($id, $duree)
  {
    require LEGACY_PATH . "/connexion.php";
    $query =
      "UPDATE " .
      $this->nom_PP .
      " SET dureeConservation = '" .
      $duree .
      "' WHERE idMedic = '" .
      $id .
      "'";
    $dbh->exec($query);
    return $query;
  }

  public function setindication($id, $indic)
  {
    require LEGACY_PATH . "/connexion.php";
    $query =
      "UPDATE " .
      $this->nom_PP .
      " SET indication = '" .
      addslashes($indic) .
      "' WHERE idMedic = '" .
      $id .
      "'";
    $dbh->exec($query);
    return $query;
  }

  private function statistiques($id)
  {
    require LEGACY_PATH . "/connexion.php";
    $query = "UPDATE medics_simple SET stat = stat+1 WHERE id = '" . $id . "'";
    try {
      $dbh->exec($query);
    } catch (PDOException $e) {
      echo "Échec lors de la connexion : " . $e->getMessage();
    }
    return $query;
  }
}

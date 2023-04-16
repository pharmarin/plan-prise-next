<?php

use Illuminate\Support\Facades\Auth;

$nom_table = "PP_" . Auth::user()->id;
$nom_cal = "PPcal_" . Auth::user()->id;

Auth::logout();
global $_url;

header("Location: " . $_url . "/");

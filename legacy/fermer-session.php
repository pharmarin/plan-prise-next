<?php

use Illuminate\Support\Facades\Auth;

$nom_table = "PP_" . Auth::user()->old_user->login;
$nom_cal = "PPcal_" . Auth::user()->old_user->login;

Auth::logout();
global $_url;

header("Location: " . $_url . "/");

<?php
include "./database.php";
include "./guard.php";
$_SESSION['loggedIn'] = false;
$_SESSION['user'] = null;
$_SESSION['token'] = null;
session_destroy();
?>
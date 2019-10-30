<?php
// Make sure the user is logged in, and then set the global user
session_start();
global $user;
if (array_key_exists('loggedIn', $_SESSION) and $_SESSION['loggedIn']) {
  $user = $_SESSION['user'];
} else {
  $user = null;
}
?>

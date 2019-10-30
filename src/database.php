<?php
$mysqli = new mysqli('localhost', 'NEWSUSER', '1dane&2mau', 'calendar');

if ($mysqli->connect_errno) {
  printf("Could not connect to news %s", $mysqli->connect_error);
  exit;
}
?>

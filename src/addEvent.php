<?php
include "./guard.php";
include "./database.php";
$month=$_POST['month'];
$date=$_POST['date'];
$time=$_POST['time'];
$year=$_POST['year'];
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
$tag=htmlspecialchars($_POST['tag']);
if ($tag == "") {
  $tag = NULL;
}
$name=htmlspecialchars($_POST['name']);
$formattedDate = sprintf("%04d-%02d-%02d %s:00", $year, $month, $date, $time);
$stmt = $mysqli->prepare("insert into events (time, username, description, tag) values (?, ?, ?, ?)");
$stmt->bind_param("ssss", $formattedDate, $user, $name, $tag);
$stmt->execute();
?>
OK



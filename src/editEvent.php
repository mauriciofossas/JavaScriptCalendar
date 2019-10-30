<?php
include "./guard.php";
include "./database.php";
$eid=$_POST['eid'];
$month=$_POST['month'];
$year=$_POST['year'];
$date=$_POST['date'];
$time=$_POST['time'];
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
$name=htmlspecialchars($_POST['name']);
$formattedDate = sprintf("%04d-%02d-%02d %s:00", $year, $month, $date, $time);
$stmt = $mysqli->prepare("update events set time=?,  description=? where eventId=?");
$stmt->bind_param("sss", $formattedDate, $name, $eid);
$stmt->execute();
?>
OK

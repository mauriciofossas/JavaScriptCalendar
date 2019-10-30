<?php
include "./guard.php";
include "./database.php";
$eid=$_POST['eid'];
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
$stmt = $mysqli->prepare("delete from events where eventId=?");
$stmt->bind_param("s", $eid);
$stmt->execute();
?>
OK

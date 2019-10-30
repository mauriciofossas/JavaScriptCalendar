<?php
include "./guard.php";
include "./database.php";

// Get and return tags

$stmt = $mysqli->prepare("select distinct tag from events where username=? and tag is not null");
$stmt->bind_param("s", $user);
$stmt->execute();
$stmt->bind_result($tag);
$tags = array();
while ($stmt->fetch()) {
  array_push($tags, $tag);
}

// Get and return events

$month = $_GET['month'];
$year = $_GET['year'];
$stmt = $mysqli->prepare("select time, description, tag, eventId from events where username=? and YEAR(time)=? and MONTH(time)=?");
$stmt->bind_param("sss", $user, $year, $month);
$stmt->execute();
$stmt->bind_result($time, $name, $tag, $eid);
$events = array();
while($stmt->fetch()) {
  $event = null;
  sscanf($time, "%d-%d-%d %d:%d:00", $event->year, $event->month, $event->date, $event->hour, $event->minute);
  $event->name = $name;
  $event->id = $eid;
  $event->tag = $tag;
  array_push($events, $event);
}
$res = new stdClass();
$res->tags = $tags;
$res->events = $events;
echo json_encode($res);
?>

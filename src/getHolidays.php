<?php
$months = array( 0 => "January",1 => "February",2 => "March",3 => "April",4 => "May",5 => "June", 6 => "July", 7 => "August", 8 => "September", 9 => "October",10 => "November", 11 => "December");
$year = intval($_GET['year']);
$month = $_GET['month'];
$filename = sprintf("../holidays/%d-holidays.csv", $year);
if (!file_exists($filename)) {
  $command = sprintf("emacs --batch --eval='(setq year %d)' -l ../scripts/get_holidays.el", $year);
  system($command);
  rename("$year-holidays.csv", $filename);
}
$handle = fopen("$filename", "r");
$res = array();
while($data = fgetcsv($handle)) {
  if($data[0] == $months[$month]) {
    $el = new stdClass();
    $el->day = intval($data[1]);
    $el->holiday = $data[2];
    array_push($res, $el);
  }
}
echo json_encode($res);
?>

<?php
include "./database.php";
session_start();
$username = $_POST["username"];
$password = password_hash($_POST["password"], PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("insert into users (username, userPass) values (?, ?)");
$stmt->bind_param('ss', $username, $password);
$stmt->execute();
if ($stmt->errno == 1062) {
  http_response_code(403);
  echo "Username already in use.";
} else {
  echo "OK";
  $_SESSION["loggedIn"] = true;
  $_SESSION["user"] = $username;
  $_SESSION["token"] = bin2hex(random_bytes(32));
}
?>
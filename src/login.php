<?php
include "./database.php";
session_start();
$username = $_POST["username"];
$password = $_POST["password"];

$stmt = $mysqli->prepare("select userPass from users where username=? limit 1");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($password_hash);
$stmt->fetch();
if (password_verify($password, $password_hash)) {
  $_SESSION["loggedIn"] = true;
  $_SESSION["user"] = $username;
  $_SESSION["token"] = bin2hex(random_bytes(32));
  echo "OK";
} else {
  http_response_code(403);
  echo "Bad username or password";
}
?>
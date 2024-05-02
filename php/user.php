<?php

session_start();

// if the session is malformed, kill it and exit
if (!isset($_SESSION["user_id"])) {
  session_abort();
  die("The session was not constructed correctly; probably because the user did not login.");
}

// otherwise, grab the user id as an integer
$user_id = intval($_SESSION["user_id"]);

// credentials
$db_username = "root";
$db_password = "";
$db_hostname = "localhost";
$db_database = "team_project";

// connect to database
$db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);

// throw an error if the connection failed
if (!$db) {
  die("Failed to connect to " . $db_username . "@" . $db_hostname . mysqli_connect_error());
}

// extract the user's information
$result = $db->query("SELECT name, email, rating FROM users WHERE id = $user_id")->fetch_assoc();
// include the user's items
$result["items"] = $db->query("SELECT * FROM items WHERE owner = $user_id")->fetch_all(MYSQLI_ASSOC);

echo json_encode($result);

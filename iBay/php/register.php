<?php

// first, connect to the database
$db = mysqli_connect("localhost", "group4", "Ra4nPnYuNAmpqYJpPipE", "group4");

// if the connection failed, exit
if (!$db) {
  die("Failed to connect to team_project at root@localhost: " . mysqli_connect_error());
}

// read and decode the data given to the registration form (into an associative array)
$details = json_decode(file_get_contents("php://input"), true);

// the following keys should exist, and if they do their values are escaped
$name = $db->real_escape_string($details["name"]);
$email = $db->real_escape_string($details["email"]);
$password = $db->real_escape_string($details["password"]);
$address = $db->real_escape_string($details["address"]);
$postcode = $db->real_escape_string($details["postcode"]);


// this command inserts a new user into the database
$command = "
INSERT INTO users (name, email, password, address, postcode) 
VALUES 
  (
    \"$name\",
    \"$email\",
    \"$password\",
    \"$address\",
    \"$postcode\"
  )
";

$success = false;
try {
  // because this is an INSERT command, the type of $success is true|false
  $success = $db->query($command);
} catch (mysqli_sql_exception $e) {
  // this exception branch typically occurs because a user tried to use an email already in-use
  die(json_encode([
    "success" => false,
    "message" => $e->getMessage(),
    "sqlstate" => $e->getSqlState(),
    "backtrace" => $e->getTraceAsString(),
  ]));
}

// if successful, log the user in
if ($success) {
  session_start();
  $_SESSION['auth'] = true;
  $_SESSION['user_id'] = $db->insert_id; // grab the user_id without an additional query
  session_commit();
}

// return $success to indicate... y'know... success
echo json_encode(["success" => $success]);

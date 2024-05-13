<?php

// first, connect to the database
$db = mysqli_connect("localhost", "group4", "Ra4nPnYuNAmpqYJpPipE", "group4");

// if the connection failed, exit
if (!$db) {
  die(json_encode(["success" => false, "message" => "failed to connect to database"]));
}

// read and decode the data given to the registration form (into an associative array)
$details = json_decode(file_get_contents("php://input"), true);

if (!$details["name"]) {
  die(json_encode(["success" => false, "message" => "missing field: username"]));
}

if (!$details["email"]) {
  die(json_encode(["success" => false, "message" => "missing field: email"]));
}

if (!$details["password"]) {
  die(json_encode(["success" => false, "message" => "missing field: password"]));
}

if (!$details["address"]) {
  die(json_encode(["success" => false, "message" => "missing field: address"]));
}

if (!$details["postcode"]) {
  die(json_encode(["success" => false, "message" => "missing field: postcode"]));
}

// the following keys exist at this point, and their values should be escaped
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

<?php

session_start();

// if the session is malformed, throw an error and die
if (!isset($_SESSION["user_id"])) {
  die(json_encode([
    "success" => false,
    "session_id" => session_id(),
    "message" => "Encountered a malformed session; the 'user_id' key is unset.",
  ]));
}

$id = $_SESSION["user_id"];

// connect to the database
$db = mysqli_connect("localhost", "root", "", "team_project");

// exit if the connection failed
if (!$db) {
  die("Failed to connect to team_project at root@localhost: " . mysqli_connect_error());
}

// read and decode the data given to the "Update details" form
$new_details = json_decode(file_get_contents("php://input"), true);

// filter the array for non-empty strings
$updated_details = array_filter($new_details, fn($value) => $value !== "");

// convert the remaining key-value pairs into sql actions
$sql_actions = array_map(
  fn($key, $value) => "$key = \"$value\"",
  array_keys($updated_details), 
  array_values($updated_details)
);

// construct the command by joining actions together and adding the remaining sql syntax structure
$actions = implode(", ", $sql_actions);
$command = "UPDATE users SET $actions WHERE id = $id";

// execute the command and check the result
// NOTE: because the user can't change their email, this should never throw an exception
$result = $db->query($command);

echo json_encode(["success" => true]);

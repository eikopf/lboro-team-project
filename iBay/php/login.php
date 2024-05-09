<?php
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

// read in the body of the request
// we expect to have the keys "email" and "password" mapping to string values
$raw_json = file_get_contents('php://input');
// decode the raw json data into an associative array
$json = json_decode($raw_json, true);
// extract email and password while escaping any dangerous characters
$email = $db->real_escape_string($json["email"]);
$password = $db->real_escape_string($json["password"]);

// this query returns one row if the given email + password combination is valid, and 0 otherwise.
// importantly, this row is NOT returned; only whether or not it exists
$query = "SELECT id FROM users WHERE email = \"$email\" AND password = \"$password\"";
$result = $db->query($query);
$query_is_valid = $result->num_rows == 1;

// if the login was successful, then start a session
if ($query_is_valid) {
  session_start();
  // declare this session to be logged in (which can be used later for security checks)
  $_SESSION["auth"] = true;
  // stash the user's id (as a string) for future db queries
  $_SESSION["user_id"] = $result->fetch_assoc()["id"];
  // commit the given information to the session and close it
  session_commit();
}

// send response as a simple bool, which will be true iff the user's credentials were correct
echo json_encode($query_is_valid);

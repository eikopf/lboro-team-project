<?php
// credentials
$db_username = "root";
$db_password = "";
$db_hostname = "localhost";
$db_database = "team_project";


// read in the body of the request
$raw_json = file_get_contents('php://input');
// decode data with fields:
// "query" {string}
// "start_date" {string}
// "end_date" {string} (but can be null if maximum date)
// "min_rating" {int}
// "max_rating" {int}
// "min_price" {int}
// "max_price" {int}
$json = json_decode($raw_json, true);

// connect to database
$db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);

// throw an error if the connection failed
if (!$db) {
  die("Failed to connect to " . $db_username . "@" . $db_hostname . mysqli_connect_error());
}

$query = $db->real_escape_string($json["query"]);

// do query
$result = $db->query(
  "SELECT * FROM items 
    WHERE title LIKE \"%$query%\""
);

// return aggregated data as JSON
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

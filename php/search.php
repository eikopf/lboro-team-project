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
// "category" {string}
// "start_date" {string}
// "end_date" {string}
// "min_rating" {int}
// "min_price" {int}
// "max_price" {int}
$json = json_decode($raw_json, true);

// connect to database
$db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);

// throw an error if the connection failed
if (!$db) {
  die("Failed to connect to " . $db_username . "@" . $db_hostname . mysqli_connect_error());
}

// escape special characters (prevents SQL injection)
$query = $db->real_escape_string($json["query"]);
$category = $json["category"];
$start_date = $json["start_date"];
$end_date = $json["end_date"];
$min_rating = $json["min_rating"];
$min_price = $json["min_price"];
$max_price = $json["max_price"];

// do query
$result = $db->query(
  "SELECT 
  items.id, 
  items.title, 
  items.description, 
  items.categories, 
  items.price, 
  items.postage, 
  items.start, 
  items.finish, 
  users.id as owner_id, 
  users.name as owner, 
  users.email as owner_email, 
  users.rating as owner_rating
  FROM items, users 
    WHERE items.owner = users.id
    AND items.title LIKE \"%$query%\"
    AND items.categories LIKE \"%$category%\"
    AND items.start >= \"$start_date\"
    AND items.finish <= \"$end_date\"
    AND users.rating >= $min_rating
    AND items.price >= $min_price
    AND items.price <= $max_price
"
);

// return aggregated data as JSON
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

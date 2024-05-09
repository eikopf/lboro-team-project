<?php

// start session
session_start();

// check if the user is logged in
if (!isset($_SESSION['auth'])) {
  die(json_encode([
    "success" => false, 
    "message" => "The user is not logged in."
  ]));
}

// read in the new item info
$new_item = json_decode(file_get_contents("php://input"), true);

// credentials
$db_username = "root";
$db_password = "";
$db_hostname = "localhost";
$db_database = "team_project";

// connect to database
$db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);

// die if database connection failed
if (!$db) {
  die(json_encode([
    "success" => false, 
    "message" => "Failed to connect to the database."
  ]));
}

// extract request elements and escape them as necessary
$title = $db->real_escape_string($new_item["title"]);
$description = $db->real_escape_string($new_item["description"]);
$category = $db->real_escape_string($new_item["category"]);
$price = $db->real_escape_string($new_item["price"]);
$postage = $db->real_escape_string($new_item["postage"]);
$start = $db->real_escape_string($new_item["start"]);
$end = $db->real_escape_string($new_item["end"]);
// image data doesn't need to be escaped
$images = $new_item["images"];

// also, pull out the user_id from the session
$user_id = $_SESSION["user_id"];

// first, insert the item
$query = "
INSERT INTO items 
(owner, title, description, categories, price, postage, start, finish)
VALUES 
(
  $user_id,
  \"$title\", 
  \"$description\", 
  \"$category\", 
  $price, 
  $postage, 
  \"$start\", 
  \"$end\"
)
";

// insert the item
$result = $db->query($query);

// get the item's id
$item_id = $db->insert_id;

// construct the suffix of the sql query
$query_suffix = join(", ", array_map(
  fn($data) => "($item_id, \"$data\")", 
  $images
));

// construct the image insertion query
$query = "INSERT INTO images (item, data) VALUES $query_suffix";

// insert the images
$result = $db->query($query);

echo json_encode(["success" => true]);

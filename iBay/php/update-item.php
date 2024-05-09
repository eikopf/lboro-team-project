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
    "message" => "failed to connect to the database"
  ]));
}

// validate the input parameters
if (!$new_item["title"]) {
  die(json_encode(["success" => false, "message" => "a title was not provided"]));
}

if (!$new_item["description"]) {
  die(json_encode(["success" => false, "message" => "a description was not provided"]));
}

if (!isset($new_item["category"])) {
  die(json_encode(["success" => false, "message" => "a category was not provided"]));
}

if (!isset($new_item["price"])) {
  die(json_encode(["success" => false, "message" => "a valid price was not provided"]));
}

if (!isset($new_item["postage"])) {
  die(json_encode(["success" => false, "message" => "a valid postage fee was not provided"]));
}

if (!$new_item["start"]) {
  die(json_encode(["success" => false, "message" => "a stating date was not provided"]));
}

if (!$new_item["end"]) {
  die(json_encode(["success" => false, "message" => "an ending date was not provided"]));
}

// extract request elements and escape them as necessary
$item_id = $db->real_escape_string($new_item["id"]);
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

// first, update the item
$query = "
UPDATE items SET
  owner = $user_id,
  title = \"$title\",
  description = \"$description\",
  categories = \"$category\",
  price = $price,
  postage = $postage,
  start = \"$start\",
  finish = \"$end\"
  WHERE 
    items.id = $item_id;
";

// catch the error thrown if the update fails
$result = false;
try { 
  $result = $db->query($query);
} catch (mysqli_sql_exception $e) {
  die(json_encode(["success" => false, "message" => $e->getMessage()]));
}

// if there are no images, exit successfully
if (count($images) == 0) {
  die(json_encode(["success" => true]));
}

// otherwise, we continue on and add new images

// remove all the images currently associated with the item
$db->query("DELETE FROM images WHERE item = $item_id");

// construct the suffix of the sql query
$query_suffix = join(", ", array_map(
  fn($data) => "($item_id, \"$data\")", 
  $images
));

// construct the image insertion query
$query = "INSERT INTO images (item, data) VALUES $query_suffix";

// insert the images
$result = $db->query($query);

// return successfully
echo json_encode(["success" => true]);

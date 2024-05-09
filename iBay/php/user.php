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
$db = mysqli_connect("localhost", "group4", "Ra4nPnYuNAmpqYJpPipE", "group4");

// throw an error if the connection failed
if (!$db) {
  die("Failed to connect to " . $db_username . "@" . $db_hostname . mysqli_connect_error());
}

// extract the user's information
$result = $db->query(
  "SELECT name, email, rating, address, postcode FROM users WHERE id = $user_id"
)->fetch_assoc();
// include the user's items
$result["items"] = $db->query(
"SELECT 
items.id, 
items.title, 
items.description, 
items.categories, 
items.price, 
items.postage, 
items.start, 
items.finish, 
images.id AS image_id,
images.data AS image_data
FROM items LEFT JOIN
  (SELECT item, id, data FROM images GROUP BY item) AS images
  ON items.id = images.item
  WHERE items.owner = $user_id
"
)->fetch_all(MYSQLI_ASSOC);

echo json_encode($result);

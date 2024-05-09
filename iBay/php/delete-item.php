<?php

// connect to the database
$db = mysqli_connect("localhost", "group4", "Ra4nPnYuNAmpqYJpPipE", "group4");

// if the connection failed, exit
if (!$db) {
  die(json_encode([
    "success" => false, 
    "message" => "Failed to connect to database: " . mysqli_connect_error()
  ]));
}

// read and decode the data given in the body of the request
$body = json_decode(file_get_contents("php://input"), true);

// if no id was given, exit
if (!$body["id"]) {
  die(json_encode(["success" => false, "message" => "expected (but did not receive) an item id"]));
}

// extract the item id
$item_id = $db->real_escape_string($body["id"]);

// ensure that the user is logged in
session_start();
if (!isset($_SESSION["auth"])) {
  die(json_encode(["success" => false, "message" => "could not find a logged-in user"]));
}

// grab the user's id
$user_id = $_SESSION["user_id"];

// delete the item and its images iff the user *actually* owns the item
$result = $db->query("
DELETE FROM items, images 
  USING items LEFT JOIN images
    ON items.id = images.item
      WHERE items.id = $item_id
      AND items.owner = $user_id
");

echo json_encode(["success" => true]);

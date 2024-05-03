<?php

// start or resume a session
session_start();

// assume user is not logged in by default
$user_login_status = false;

// if the 'auth' key is undefined or false, the user is not logged in
if (!isset($_SESSION['auth']) || !$_SESSION['auth']) {
  $user_login_status = false;
// if the 'auth' key maps to true, the user is logged in
} elseif ($_SESSION['auth']) {
  $user_login_status = true;
// otherwise the session is probably mangled, so clean up and exit
} else {
  session_abort();
  die("Encounter malformed session data.");
}

// return the bool as a json value
echo json_encode($user_login_status);

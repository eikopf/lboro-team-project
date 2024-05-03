<?php
// the logout sequence essentially amounts to the destruction of the user session

// resume the session that we presume exists at this point
session_start();

// free all data in the session
session_unset();

// signal to the user agent that it should delete the PHPSESSID cookie
if (ini_get("session.use_cookies")) {
  $conf = session_get_cookie_params();
  setcookie(
    session_name(),
    "",
    // set expiry date to some point in the past
    time() - 50_000,
    $conf["path"],
    $conf["domain"],
    $conf["secure"],
    $conf["httponly"]
  );
}

// mark the session for GC
session_destroy();

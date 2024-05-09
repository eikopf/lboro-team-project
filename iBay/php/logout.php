<?php
// the logout sequence essentially amounts to the destruction of the user session

// resume the session that we presume exists at this point
session_start();

// signal to the user agent that it should delete the PHPSESSID cookie
setcookie(session_name(), session_id(), 1);

// free all data in the session
session_unset();

// mark the session for GC
session_destroy();

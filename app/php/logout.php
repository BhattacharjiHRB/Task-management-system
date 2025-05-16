<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Unset all session variables
    $_SESSION = array();

    // Destroy the session
    session_destroy();

    // Remove the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Redirect to login page
    header("Location: /Task-management-system/login.html");
    exit();
} else {
    // If not POST, redirect to login page directly
    header("Location: /Task-management-system/login.html");
    exit();
}
?>
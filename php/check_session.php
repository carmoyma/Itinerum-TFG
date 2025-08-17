<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['user'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => [
            "username" => $_SESSION['user']['username'],
            "email" => $_SESSION['user']['email'],
            "isPro" => $_SESSION['user']['subs'] ?? null  // <-- aquí el cambio
        ]
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>

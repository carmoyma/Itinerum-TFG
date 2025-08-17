<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db_config.php'; 

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode([
        'loggedIn' => false,
        'isPro' => false
    ]);
    exit;
}

try {
    $conn = getDbConnection();

    $stmt = $conn->prepare("SELECT is_pro FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($isProValue);
    $stmt->fetch();

    $isPro = $isProValue == 1;

    $stmt->close();
    $conn->close();

    echo json_encode([
        'isLoggedIn' => true,
        'isPro' => $isPro
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor']);
}

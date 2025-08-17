<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json');

try {
    if (!isset($_SESSION['user']['id'])) {
        throw new Exception('No autenticado');
    }

    require_once __DIR__ . '/../db_config.php';
    $mysqli = getDbConnection();

    $userId = $_SESSION['user']['id'];

   
    $stmtDelete = $mysqli->prepare("DELETE FROM users WHERE id = ?");
    if (!$stmtDelete) {
        throw new Exception("Error al preparar la consulta: " . $mysqli->error);
    }

    $stmtDelete->bind_param("i", $userId);

    if (!$stmtDelete->execute()) {
        throw new Exception("Error al eliminar la cuenta: " . $stmtDelete->error);
    }

    $stmtDelete->close();
    $mysqli->close();


    session_destroy();

    echo json_encode(['success' => true, 'redirect' => 'bye.html']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

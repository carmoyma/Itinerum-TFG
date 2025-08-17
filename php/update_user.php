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

    
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['field']) || !isset($data['value'])) {
        throw new Exception('Datos incompletos o JSON inválido');
    }

    $field = $data['field'];
    $value = trim($data['value']);
    $userId = $_SESSION['user']['id'];

   
    $allowedFields = ['username', 'email', 'password'];
    if (!in_array($field, $allowedFields)) {
        throw new Exception('Campo no permitido');
    }

   
    if ($field === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    if ($field === 'password') {
        if (strlen($value) < 6) {
            throw new Exception('La contraseña debe tener al menos 6 caracteres');
        }
        
        $valueHashed = password_hash($value, PASSWORD_DEFAULT);
    } else {
        $valueHashed = $value;
    }

    
    if ($field === 'username' || $field === 'email') {
        $stmtCheck = $mysqli->prepare("SELECT id FROM users WHERE $field = ? AND id != ? LIMIT 1");
        if (!$stmtCheck) {
            throw new Exception("Error en la consulta de verificación: " . $mysqli->error);
        }
        $stmtCheck->bind_param("si", $value, $userId);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            $stmtCheck->close();
            throw new Exception(ucfirst($field) . ' ya está en uso');
        }
        $stmtCheck->close();
    }

    
    $stmtUpdate = $mysqli->prepare("UPDATE users SET $field = ? WHERE id = ?");
    if (!$stmtUpdate) {
        throw new Exception("Error en la consulta de actualización: " . $mysqli->error);
    }
    $stmtUpdate->bind_param("si", $valueHashed, $userId);

    if (!$stmtUpdate->execute()) {
        throw new Exception("Error al actualizar los datos: " . $stmtUpdate->error);
    }

    
    if ($field !== 'password') {
        $_SESSION['user'][$field] = $value;
    }

    echo json_encode(['success' => true]);

    $stmtUpdate->close();
    $mysqli->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

require_once __DIR__ . '/../db_config.php';

if (!isset($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$user_id = $_SESSION['user']['id'];

$conn = getDbConnection();

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la conexión: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT id_itinerario AS id, nombre FROM itinerarios WHERE id_usuario = ? ORDER BY nombre ASC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la preparación: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

$itineraries = [];

while ($row = $result->fetch_assoc()) {
    $itineraries[] = $row;
}

echo json_encode($itineraries);

$stmt->close();
$conn->close();

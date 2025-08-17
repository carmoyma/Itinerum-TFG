<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../db_config.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de itinerario inválido']);
    exit;
}

$id_itinerario = (int) $_GET['id'];

$conn = getDbConnection();

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la conexión: ' . $conn->connect_error]);
    exit;
}

$sql = "
    SELECT
        l.id, 
        l.nombre, 
        l.descripcion, 
        l.direccion,
        l.imagen,
        l.horario,
        il.orden 
    FROM itinerario_lugares il
    JOIN lugares l ON il.id_lugar = l.id
    WHERE il.id_itinerario = ?
    ORDER BY il.orden ASC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Error preparando la consulta: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $id_itinerario);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error ejecutando la consulta: ' . $stmt->error]);
    exit;
}

$result = $stmt->get_result();

$lugares = [];
while ($row = $result->fetch_assoc()) {
    $lugares[] = $row;
}

echo json_encode($lugares);

$stmt->close();
$conn->close();

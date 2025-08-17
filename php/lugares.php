<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db_config.php'; // Ajusta la ruta si es necesario

try {
    $conn = getDbConnection();

    $sql = "SELECT * FROM lugares";
    $result = $conn->query($sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
        exit;
    }

    $lugares = [];
    while ($row = $result->fetch_assoc()) {
        $lugares[] = $row;
    }

    echo json_encode($lugares);

    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

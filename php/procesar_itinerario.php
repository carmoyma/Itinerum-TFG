<?php
ini_set('session.cookie_secure', '1');  
ini_set('session.cookie_samesite', 'Lax');
session_start();

header('Content-Type: application/json');


error_log("Session save path: " . session_save_path());
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));


if (!isset($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No has iniciado sesión."]);
    exit;
}

$id_usuario = $_SESSION['user']['id'];




require_once __DIR__ . '/../db_config.php';
$conn = getDbConnection();


$datos = json_decode(file_get_contents("php://input"), true);
if (!isset($datos['lugares_seleccionados']) || !is_array($datos['lugares_seleccionados'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan los lugares seleccionados."]);
    exit;
}

$lugares = $datos['lugares_seleccionados'];
if (count($lugares) === 0) {
    http_response_code(400);
    echo json_encode(["error" => "Debes seleccionar al menos un lugar."]);
    exit;
}

$nombre_itinerario = "Itinerario de " . date("Y-m-d H:i:s");

$conn->autocommit(false);

try {
    $stmt = $conn->prepare("INSERT INTO itinerarios (id_usuario, nombre) VALUES (?, ?)");
    $stmt->bind_param("is", $id_usuario, $nombre_itinerario);
    if (!$stmt->execute()) {
        throw new Exception("Error al insertar itinerario: " . $stmt->error);
    }
    $id_itinerario = $conn->insert_id;
    $stmt->close();

    $stmtLugar = $conn->prepare("INSERT INTO itinerario_lugares (id_itinerario, id_lugar, orden) VALUES (?, ?, ?)");
    foreach ($lugares as $orden => $id_lugar) {
        $ordenReal = $orden + 1;
        $stmtLugar->bind_param("iii", $id_itinerario, $id_lugar, $ordenReal);
        if (!$stmtLugar->execute()) {
            throw new Exception("Error insertando lugar: " . $stmtLugar->error);
        }
    }
    $stmtLugar->close();

    $conn->commit();
    echo json_encode(["success" => true, "id_itinerario" => $id_itinerario]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>

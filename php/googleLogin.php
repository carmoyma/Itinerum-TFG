<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../db_config.php'; 

$input = json_decode(file_get_contents('php://input'), true);
$id_token = $input['token'] ?? '';

if (!$id_token) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token no proporcionado']);
    exit;
}


$verify_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($id_token);
$response = file_get_contents($verify_url);
$payload = json_decode($response, true);

if (!$payload || isset($payload['error_description'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token inválido']);
    exit;
}

$email = $payload['email'];
$username = $payload['name'] ?? '';


$conn = getDbConnection();


$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    $stmtInsert = $conn->prepare("INSERT INTO users (email, username, created_at) VALUES (?, ?, NOW())");
    $stmtInsert->bind_param("ss", $email, $username);
    $stmtInsert->execute();
    $user_id = $stmtInsert->insert_id;
    $stmtInsert->close();

    $user = [
        'id' => $user_id,
        'email' => $email,
        'username' => $username,
        'subs' => null
    ];
}

$_SESSION['user'] = $user;

echo json_encode([
    'success' => true,
    'message' => 'Login con Google exitoso',
    'data' => $user
]);
?>

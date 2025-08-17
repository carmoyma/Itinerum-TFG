<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db_config.php';

try {
    $conn = getDbConnection();

    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $captchaToken = $data['captcha'] ?? '';

    if (!$email || !$password || !$captchaToken) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Faltan datos o captcha.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Formato de email no válido']);
        exit;
    }

   
    $secretKey = '6Lf_xkYrAAAAAChN3ypCZjUtiPKvR7d-QdM-Ra9y'; 
    $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    $response = file_get_contents($verifyUrl . '?secret=' . urlencode($secretKey) . '&response=' . urlencode($captchaToken));
    $captchaResult = json_decode($response, true);

    if (!$captchaResult['success']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Captcha inválido. Intenta de nuevo.']);
        exit;
    }

    $username = explode('@', $email)[0];

    
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'El correo ya está registrado.']);
        $check->close();
        exit;
    }
    $check->close();

   
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashed_password);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado correctamente',
            'name' => $username,
            'email' => $email
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de servidor: ' . $e->getMessage()]);
}

<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db_config.php'; 

try {
    $conn = getDbConnection();

    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $captchaToken = $input['captcha'] ?? '';  

    if (!$email || !$password || !$captchaToken) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Faltan datos o captcha']);
        exit;
    }

    
    $secretKey = '6Lf_xkYrAAAAAChN3ypCZjUtiPKvR7d-QdM-Ra9y'; 
    $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    
    $data = http_build_query([
        'secret' => $secretKey,
        'response' => $captchaToken,
        'remoteip' => $_SERVER['REMOTE_ADDR'] 
    ]);

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => $data,
        ],
    ];

    $context  = stream_context_create($options);
    $response = file_get_contents($verifyUrl, false, $context);
    $captchaResult = json_decode($response, true);

    if (!$captchaResult['success']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Captcha inválido. Intenta de nuevo.']);
        exit;
    }

   
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception('Error en prepare statement: ' . $conn->error);
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        $stmt->close();
        $conn->close();
        exit;
    }

    if (password_verify($password, $user['password'])) {
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'username' => $user['username'],
            'subs' => $user['subs']
        ];

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Login correcto',
            'data' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'username' => $user['username'],
                'subs' => $user['subs']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}

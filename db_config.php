<?php
// Configuración de la base de datos
$db_config = [
    'host' => 'sql212.infinityfree.com',
    'port' => '3306',
    'dbname' => 'if0_39062275_Itinerum',
    'username' => 'if0_39062275',
    'password' => 'D1neCq0rinzQ',
    'charset' => 'utf8mb4'
];

// Función para obtener conexión MySQLi
function getDbConnection() {
    global $db_config;
    $conn = new mysqli(
        $db_config['host'],
        $db_config['username'],
        $db_config['password'],
        $db_config['dbname'],
        $db_config['port']
    );
    if ($conn->connect_error) {
        error_log("Error de conexión: " . $conn->connect_error);
        throw new Exception("Error al conectar a la base de datos");
    }
    // Establecer charset
    $conn->set_charset($db_config['charset']);
    return $conn;
}
?>
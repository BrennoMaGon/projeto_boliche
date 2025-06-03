<?php
$config = [
    'host' => 'localhost',
    'user' => 'root',
    'pass' => '',
    'name' => 'boliche'
];

if (file_exists(__DIR__.'/config.local.php')) {
    include __DIR__.'/config.local.php';
}

$conn = new mysqli(
    $config['host'],
    $config['user'],
    $config['pass'],
    $config['name']
);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}
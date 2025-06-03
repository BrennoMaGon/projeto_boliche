<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include __DIR__.'/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$nome = $data['nome'] ?? null;

if (!$nome) {
    http_response_code(400);
    echo json_encode(['error' => 'Nome não fornecido']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO jogadores (nome, pontuacao_total) VALUES (?, 0)");
    $stmt->bind_param("s", $nome);
    $stmt->execute();
    
    echo json_encode(['status' => 'success', 'id' => $conn->insert_id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor: '.$e->getMessage()]);
}

$conn->close();
?>
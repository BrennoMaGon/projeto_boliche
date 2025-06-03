<?php
require_once __DIR__.'/config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$nome = $data['nome'] ?? null;

if (!$id || !is_numeric($id) || !$nome) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos fornecidos']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE jogadores SET nome = ? WHERE id = ?");
    $stmt->bind_param("si", $nome, $id); 
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Nome do jogador atualizado com sucesso']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Jogador não encontrado ou nome inalterado']);
    }
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro no servidor: '.$e->getMessage()]);
}

$conn->close();
?>
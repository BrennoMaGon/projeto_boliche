<?php
require_once __DIR__.'/config.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID inválido ou não fornecido']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM jogadores WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Jogador deletado com sucesso']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Jogador não encontrado ou já deletado']);
    }
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro no servidor: '.$e->getMessage()]);
}

$conn->close();
?>
<?php
require_once __DIR__.'/config.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $conn->prepare("UPDATE jogadores SET pontuacao_total = pontuacao_total + ? WHERE nome = ?");
    $stmt->bind_param("is", $data['pontos'], $data['jogador']);
    $stmt->execute();
    
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$conn->close();
?>
<?php
require_once __DIR__.'/config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'JSON inválido recebido.']);
        exit;
    }

    if (!isset($data['jogadores']) || !is_array($data['jogadores']) || empty($data['jogadores'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nenhum jogador fornecido.']);
        exit;
    }

    if (!isset($data['rodadas']) || !is_numeric($data['rodadas']) || $data['rodadas'] <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Número de rodadas inválido.']);
        exit;
    }

    $conn->begin_transaction();
    $conn->query("TRUNCATE TABLE partidas_temp");

    $stmt = $conn->prepare("INSERT INTO partidas_temp (nome, rodadas) VALUES (?, ?)");
    foreach ($data['jogadores'] as $nome) {
        if (!is_string($nome) || trim($nome) === '') {
            throw new Exception("Nome de jogador inválido encontrado.");
        }
        $stmt->bind_param("si", $nome, $data['rodadas']);
        $stmt->execute();
    }
    $stmt->close();

    $conn->commit();

    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    if ($conn && $conn->in_transaction) {
        $conn->rollback();
    }
    http_response_code(500); 
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar partida: ' . $e->getMessage()]);
} finally {
    if ($conn) {
        $conn->close();
    }
}
?>
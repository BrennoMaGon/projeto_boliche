<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');

$response = [
    'status' => 'error',
    'jogadores' => [],
    'rodadas' => 10,
    'message' => 'Erro desconhecido'
];

try {
    require_once __DIR__.'/config.php';
    
    // Verifique se a conexão existe
    if (!$conn) {
        throw new Exception("Não foi possível conectar ao banco de dados");
    }

    $result = $conn->query("SELECT nome, rodadas FROM partidas_temp ORDER BY id DESC LIMIT 6");
    
    if ($result === false) {
        throw new Exception("Erro na consulta SQL: " . $conn->error);
    }

    $response['jogadores'] = [];
    while($row = $result->fetch_assoc()) {
        $response['jogadores'][] = $row['nome'];
        if (count($response['jogadores']) === 1) {
            $response['rodadas'] = (int)$row['rodadas'];
        }
    }
    
    $response['status'] = 'success';
    $response['message'] = 'Dados carregados com sucesso';

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = $e->getMessage();
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}

echo json_encode($response);
?>
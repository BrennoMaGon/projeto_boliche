<?php
require_once __DIR__.'/config.php';
header('Content-Type: application/json');

// --- RECOMENDAÇÃO DE SEGURANÇA ---
// É ALTAMENTE recomendado que você adicione alguma forma de autenticação/autorização
// aqui, ou pelo menos um token simples, para evitar que qualquer pessoa possa
// resetar seu ranking. Por exemplo:
// if (!isset($_POST['admin_token']) || $_POST['admin_token'] !== 'SEU_TOKEN_SECRETO') {
//     http_response_code(403); // Forbidden
//     echo json_encode(['error' => 'Acesso negado ou token inválido']);
//     exit;
// }
// Para testar, você pode omitir isso, mas para produção, é crucial.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$sql = "TRUNCATE TABLE jogadores"; 

if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Ranking resetado com sucesso.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro ao deletar todos os jogadores: ' . $conn->error]);
}
$conn->close(); 
?>
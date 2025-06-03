<?php
header('Content-Type: text/plain');

echo "Instalando banco de dados...\n\n";

// Configurações (ajuste conforme necessário)
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'boliche';

try {
    // Conexão sem selecionar o banco primeiro
    $conn = new PDO("mysql:host=$db_host", $db_user, $db_pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);

    // 1. Criar o banco de dados
    echo "Criando banco de dados...\n";
    $conn->exec("CREATE DATABASE IF NOT EXISTS $db_name");
    
    // 2. Importar a estrutura e dados
    echo "Importando dados...\n";
    $sql_file = file_get_contents(__DIR__.'/../database/boliche.sql');
    
    $conn->exec("USE $db_name");
    $conn->exec($sql_file);
    
    echo "✔ Banco de dados instalado com sucesso!\n";
    echo "Acesse o sistema em: http://localhost/projeto_boliche/app\n";
    
} catch(PDOException $e) {
    echo "Erro na instalação: " . $e->getMessage() . "\n";
    echo "Verifique se o MySQL está rodando e as credenciais no arquivo.\n";
}
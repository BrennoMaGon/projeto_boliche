<?php
require_once __DIR__.'/config.php';

$sql = "SELECT * FROM jogadores ORDER BY pontuacao_total DESC";
$result = $conn->query($sql);

$jogadores = [];
while($row = $result->fetch_assoc()) {
    $jogadores[] = $row;
}

echo json_encode($jogadores);
$conn->close();
?>
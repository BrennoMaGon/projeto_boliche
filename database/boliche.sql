CREATE DATABASE IF NOT EXISTS `boliche` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `boliche`;

DROP TABLE IF EXISTS `jogadores`;
CREATE TABLE `jogadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `pontuacao_total` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `partidas_temp`;
CREATE TABLE `partidas_temp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `rodadas` int DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Schema do banco: apae_monitoramento
-- Projeto: Monitoramento de sala (Arduino) - TCC
-- ============================================

CREATE DATABASE IF NOT EXISTS apae_monitoramento;
USE apae_monitoramento;

-- ------------------------------------------------
-- Tabela: tb01_arduino
-- Representa cada dispositivo Arduino instalado
-- ------------------------------------------------
CREATE TABLE tb01_arduino (
    tb01_id INT AUTO_INCREMENT PRIMARY KEY,
    tb01_sala VARCHAR(100) NOT NULL
);

-- ------------------------------------------------
-- Tabela: tb04_professor
-- Professores que podem registrar feedback
-- ------------------------------------------------
CREATE TABLE tb04_professor (
    tb04_id_professor INT AUTO_INCREMENT PRIMARY KEY,
    tb04_nome VARCHAR(150) NOT NULL,
    tb04_email VARCHAR(150) NOT NULL UNIQUE,
    tb04_senha VARCHAR(255) NOT NULL
);

-- ------------------------------------------------
-- Tabela: tb02_leitura
-- Cada leitura de som/temperatura feita pelo Arduino
-- ------------------------------------------------
CREATE TABLE tb02_leitura (
    tb02_id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    tb02_temperatura DECIMAL(5,2) NOT NULL,
    tb02_nivel_som DECIMAL(5,2) NOT NULL,
    tb02_data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tb02_led_acionado BOOLEAN NOT NULL DEFAULT FALSE,
    tb02_descricao VARCHAR(255),
    tb02_id_arduino INT NOT NULL,
    FOREIGN KEY (tb02_id_arduino) REFERENCES tb01_arduino(tb01_id)
);

-- ------------------------------------------------
-- Tabela: tb03_feedback
-- Feedback do professor referente a uma leitura que
-- ultrapassou o limite (o que fez, o que acha que causou)
-- ------------------------------------------------
CREATE TABLE tb03_feedback (
    tb03_id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    tb03_comentario VARCHAR(500) NOT NULL,
    tb03_hora TIME NOT NULL,
    tb03_data DATE NOT NULL,
    tb03_id_professor INT NOT NULL,
    tb03_id_leitura INT NOT NULL,
    FOREIGN KEY (tb03_id_professor) REFERENCES tb04_professor(tb04_id_professor),
    FOREIGN KEY (tb03_id_leitura) REFERENCES tb02_leitura(tb02_id_leitura)
);

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /arduinos - lista todos os arduinos cadastrados
router.get('/', async (req, res) => {
    try {
        const [linhas] = await db.query('SELECT * FROM tb01_arduino');
        res.json(linhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar arduinos' });
    }
});

// POST /arduinos - cadastra um novo arduino
router.post('/', async (req, res) => {
    const { tb01_sala } = req.body;

    if (!tb01_sala) {
        return res.status(400).json({ erro: 'O campo tb01_sala é obrigatório' });
    }

    try {
        const [resultado] = await db.query(
            'INSERT INTO tb01_arduino (tb01_sala) VALUES (?)',
            [tb01_sala]
        );
        res.status(201).json({ tb01_id: resultado.insertId, tb01_sala });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar arduino' });
    }
});

module.exports = router;

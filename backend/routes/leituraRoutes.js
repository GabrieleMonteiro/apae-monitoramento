const express = require('express');
const router = express.Router();
const db = require('../db');

// Limites que disparam o alerta (embasados em estudos - ver TCC)
const LIMITE_TEMPERATURA = 28; // °C
const LIMITE_SOM = 80; // dB

// GET /leituras - lista todas as leituras (mais recentes primeiro)
router.get('/', async (req, res) => {
    try {
        const [linhas] = await db.query(
            'SELECT * FROM tb02_leitura ORDER BY tb02_data_hora DESC'
        );
        res.json(linhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar leituras' });
    }
});

// GET /leituras/:id - busca uma leitura específica
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [linhas] = await db.query(
            'SELECT * FROM tb02_leitura WHERE tb02_id_leitura = ?',
            [id]
        );

        if (linhas.length === 0) {
            return res.status(404).json({ erro: 'Leitura não encontrada' });
        }

        res.json(linhas[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar leitura' });
    }
});

// POST /leituras - o Arduino chama essa rota para registrar uma nova leitura
router.post('/', async (req, res) => {
    const { tb02_temperatura, tb02_nivel_som, tb02_id_arduino } = req.body;

    if (tb02_temperatura === undefined || tb02_nivel_som === undefined || !tb02_id_arduino) {
        return res.status(400).json({
            erro: 'Os campos tb02_temperatura, tb02_nivel_som e tb02_id_arduino são obrigatórios'
        });
    }

    // O backend decide se passou do limite e qual LED deve acender
    const ledTemperatura = tb02_temperatura > LIMITE_TEMPERATURA;
    const ledSom = tb02_nivel_som > LIMITE_SOM;

    try {
        const [resultado] = await db.query(
            `INSERT INTO tb02_leitura
                (tb02_temperatura, tb02_nivel_som, tb02_led_temperatura, tb02_led_som, tb02_id_arduino)
             VALUES (?, ?, ?, ?, ?)`,
            [tb02_temperatura, tb02_nivel_som, ledTemperatura, ledSom, tb02_id_arduino]
        );

        res.status(201).json({
            tb02_id_leitura: resultado.insertId,
            tb02_temperatura,
            tb02_nivel_som,
            tb02_led_temperatura: ledTemperatura,
            tb02_led_som: ledSom,
            tb02_id_arduino
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao registrar leitura' });
    }
});

// PUT /leituras/:id/descricao - o professor preenche (opcionalmente) o que
// causou o barulho/temperatura elevada
router.put('/:id/descricao', async (req, res) => {
    const { id } = req.params;
    const { tb02_descricao } = req.body;

    if (!tb02_descricao) {
        return res.status(400).json({ erro: 'O campo tb02_descricao é obrigatório' });
    }

    try {
        const [resultado] = await db.query(
            'UPDATE tb02_leitura SET tb02_descricao = ? WHERE tb02_id_leitura = ?',
            [tb02_descricao, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Leitura não encontrada' });
        }

        res.json({ tb02_id_leitura: id, tb02_descricao });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao atualizar descrição' });
    }
});

module.exports = router;

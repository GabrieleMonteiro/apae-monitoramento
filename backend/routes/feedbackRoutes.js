const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /feedbacks - lista todos os feedbacks
router.get('/', async (req, res) => {
  try {
    const [linhas] = await db.query(`
      SELECT 
        f.tb03_id_feedback,
        f.tb03_comentario,
        f.tb03_hora,
        f.tb03_data,
        f.tb03_id_professor,
        p.tb04_nome AS nome_professor,
        f.tb03_id_leitura,
        l.tb02_temperatura,
        l.tb02_nivel_som
      FROM tb03_feedback f
      INNER JOIN tb04_professor p ON f.tb03_id_professor = p.tb04_id_professor
      INNER JOIN tb02_leitura l ON f.tb03_id_leitura = l.tb02_id_leitura
      ORDER BY f.tb03_data DESC, f.tb03_hora DESC
    `);
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar feedbacks' });
  }
});

// POST /feedbacks - cadastra um novo feedback
router.post('/', async (req, res) => {
  const { tb03_comentario, tb03_id_professor, tb03_id_leitura } = req.body;

  if (!tb03_comentario || !tb03_id_professor || !tb03_id_leitura) {
    return res.status(400).json({ erro: 'Comentario, id_professor e id_leitura sao obrigatorios' });
  }

  try {
    const [resultado] = await db.query(
      'INSERT INTO tb03_feedback (tb03_comentario, tb03_hora, tb03_data, tb03_id_professor, tb03_id_leitura) VALUES (?, CURTIME(), CURDATE(), ?, ?)',
      [tb03_comentario, tb03_id_professor, tb03_id_leitura]
    );
    res.status(201).json({
      tb03_id_feedback: resultado.insertId,
      tb03_comentario,
      tb03_id_professor,
      tb03_id_leitura
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar feedback' });
  }
});

module.exports = router;
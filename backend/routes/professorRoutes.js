const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /professores - lista todos os professores
router.get('/', async (req, res) => {
  try {
    const [linhas] = await db.query('SELECT tb04_id_professor, tb04_nome, tb04_email FROM tb04_professor');
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar professores' });
  }
});

// POST /professores - cadastra um novo professor
router.post('/', async (req, res) => {
  const { tb04_nome, tb04_email, tb04_senha } = req.body;

  if (!tb04_nome || !tb04_email || !tb04_senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha sao obrigatorios' });
  }

  try {
    const [resultado] = await db.query(
      'INSERT INTO tb04_professor (tb04_nome, tb04_email, tb04_senha) VALUES (?, ?, ?)',
      [tb04_nome, tb04_email, tb04_senha]
    );
    res.status(201).json({ tb04_id_professor: resultado.insertId, tb04_nome, tb04_email });
  } catch (erro) {
    console.error(erro);
    if (erro.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ erro: 'E-mail ja cadastrado' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar professor' });
    }
  }
});

module.exports = router;
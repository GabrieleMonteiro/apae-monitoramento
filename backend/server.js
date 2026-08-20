require('dotenv').config();
const express = require('express');
const cors = require('cors');

const arduinoRoutes = require('./routes/arduinoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste, so pra confirmar que o servidor esta rodando
app.get('/', (req, res) => {
    res.json({ mensagem: 'API do projeto APAE monitoramento funcionando!' });
});

// Rotas do arduino
app.use('/arduinos', arduinoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

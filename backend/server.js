require('dotenv').config();
const express = require('express');
const cors = require('cors');
const arduinoRoutes = require('./routes/arduinoRoutes');
const leituraRoutes = require('./routes/leituraRoutes');
const professorRoutes = require('./routes/professorRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do projeto APAE monitoramento funcionando!' });
});

// Rotas da API
app.use('/arduinos', arduinoRoutes);
app.use('/leituras', leituraRoutes);
app.use('/professores', professorRoutes);
app.use('/feedbacks', feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
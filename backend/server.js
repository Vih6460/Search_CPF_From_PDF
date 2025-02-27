require("dotenv").config(); // Carregar variáveis do .env

const express = require("express");
const cors = require("cors");
const { admin } = require("./firebase"); // Importa instância do Firebase

// 🔹 Importação das rotas
const uploadPdf = require("./routes/uploadPdf");
const fetchCpf = require("./routes/fetchCpf");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Uso das rotas
app.use(uploadPdf);
app.use(fetchCpf);

// Iniciar o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

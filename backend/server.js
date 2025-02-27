require("dotenv").config(); // Carregar variáveis do .env

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// 🔹 Importação das rotas
const uploadPdf = require("./routes/uploadPdf");
const fetchCpf = require("./routes/fetchCpf");

// Inicializa o Firebase
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

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

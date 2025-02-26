require("dotenv").config(); // Carregar variáveis do .env

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const pdfjsLib = require("pdfjs-dist"); // Usando a versão legacy

// Inicializa o Firebase
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = express();
app.use(cors());
app.use(express.json());

const db = admin.database();
const upload = multer({ storage: multer.memoryStorage() });

// Função para extrair CPFs do texto
function extractCPFs(text) {
  const regex = /\d{3}\.\d{3}\.\d{3}-\d{2}/g;
  return text.match(regex) || [];
}

// Função para extrair texto de um PDF
async function extractTextFromPDF(pdfBuffer) {
  try {
    const pdfData = new Uint8Array(pdfBuffer); // Converter Buffer para Uint8Array
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      extractedText += textContent.items.map((item) => item.str).join(" ") + "\n";
    }

    return extractedText;
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error);
    throw new Error("Erro ao processar o PDF");
  }
}

app.get("/cpfs", async (req, res) => {
  try {
    const snapshot = await db.ref("cpfs").once("value");
    const cpfs = snapshot.val();

    if (!cpfs) {
      return res.json({ cpfs: [] });
    }

    // Converte os valores do Firebase para um array de CPFs
    const cpfList = Object.values(cpfs);

    res.json({ cpfs: cpfList });
  } catch (error) {
    console.error("Erro ao buscar CPFs do banco:", error);
    res.status(500).json({ error: "Erro ao buscar CPFs" });
  }
});

// 🔹 **Rota para processar o PDF e salvar CPFs evitando duplicados**
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado.");
  }

  try {
    const extractedText = await extractTextFromPDF(req.file.buffer);
    let cpfs = extractCPFs(extractedText);

    // 🔍 Buscar CPFs já cadastrados
    const snapshot = await db.ref("cpfs").once("value");
    const existingCpfs = new Set(snapshot.val() ? Object.values(snapshot.val()) : []);

    // 🔹 Filtrar CPFs duplicados
    const newCpfs = cpfs.filter((cpf) => !existingCpfs.has(cpf));

    // 🔹 Salvar apenas CPFs que ainda não existem no banco
    newCpfs.forEach((cpf) => db.ref("cpfs").push(cpf));

    res.json({ cpfs: newCpfs });
  } catch (error) {
    console.error("Erro ao processar o PDF:", error);
    res.status(500).send("Erro ao processar o PDF");
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

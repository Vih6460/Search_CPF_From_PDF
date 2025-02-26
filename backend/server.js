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

// Endpoint para processar o PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado.");
  }

  try {
    const extractedText = await extractTextFromPDF(req.file.buffer);
    const cpfs = extractCPFs(extractedText);

    // Salvar os CPFs no Firebase
    cpfs.forEach((cpf) => db.ref("cpfs").push(cpf));

    res.json({ cpfs });
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

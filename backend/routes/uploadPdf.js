const express = require("express");
const multer = require("multer");
const pdfjsLib = require("pdfjs-dist");
const { admin, db } = require("../firebase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Função para extrair CPFs do texto
function extractCPFs(text) {
    const regex = /\d{3}\.\d{3}\.\d{3}\s*-?\s?\d{2}/g;
    const foundCpfs = text.match(regex) || [];

    // Se foundCpfs não for vazio, criar o Set para garantir unicidade
    if (foundCpfs.length > 0) {
        const uniqueCpfs = new Set(foundCpfs);

        return Array.from(uniqueCpfs);  // Retorna o array de CPFs únicos
    }
    
    return [];
}

// Função para extrair texto de um PDF
async function extractTextFromPDF(pdfBuffer) {
    try {
        const pdfData = new Uint8Array(pdfBuffer);
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

router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("Nenhum arquivo foi enviado.");
    }

    try {
        const extractedText = await extractTextFromPDF(req.file.buffer);
        let cpfs = extractCPFs(extractedText);

        // Buscar CPFs já cadastrados
        const snapshot = await db.ref("cpfs").once("value");
        const existingCpfs = new Set(snapshot.val() ? Object.values(snapshot.val()) : []);

        // Filtrar CPFs duplicados
        const newCpfs = cpfs.filter((cpf) => !existingCpfs.has(cpf));

        // Salvar apenas CPFs que ainda não existem no banco
        newCpfs.forEach((cpf) => db.ref("cpfs").push(cpf));

        res.json({ cpfs: newCpfs });
    } catch (error) {
        console.error("Erro ao processar o PDF:", error);
        res.status(500).send("Erro ao processar o PDF");
    }
});

module.exports = router;

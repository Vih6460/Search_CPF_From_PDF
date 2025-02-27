const express = require("express");
const { db } = require("../firebase"); // Agora importando o db do firebase.js

const router = express.Router();

router.get("/cpfs", async (req, res) => {
  try {
    const snapshot = await db.ref("cpfs").once("value");
    const cpfs = snapshot.val();

    if (!cpfs) {
      return res.json({ cpfs: [] });
    }

    const cpfList = Object.values(cpfs);
    res.json({ cpfs: cpfList });
  } catch (error) {
    console.error("Erro ao buscar CPFs do banco:", error);
    res.status(500).json({ error: "Erro ao buscar CPFs" });
  }
});

module.exports = router;

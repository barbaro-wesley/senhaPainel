const express = require("express");
const { gerarSenha, chamarSenha,listarPendentes,marcarDesistencia } = require("../controllers/senha.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/gerar", gerarSenha); // Corrigido aqui
router.post("/chamar", chamarSenha);
router.get("/pendentes", authMiddleware, listarPendentes);
router.post("/desistir", marcarDesistencia)

module.exports = router;
const express = require("express");
const { gerarSenha, chamarSenha, listarPendentes, marcarDesistencia } = require("../controllers/senha.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota pública para gerar uma nova senha (não protegida por middleware)
router.post("/gerar", gerarSenha);

// Rotas protegidas por middleware de autenticação
router.post("/chamar", authMiddleware, chamarSenha); // Protegida
router.get("/pendentes", authMiddleware, listarPendentes); // Protegida
router.post("/desistir", authMiddleware, marcarDesistencia); // Protegida

module.exports = router;
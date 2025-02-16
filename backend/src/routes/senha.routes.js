const express = require("express");
const { gerarSenha, chamarSenha } = require("../controllers/senha.controller");

const router = express.Router();
router.post("/gerar", gerarSenha); // Corrigido aqui
router.post("/chamar", chamarSenha);

module.exports = router;
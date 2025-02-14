const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/user.controller");

// Rotas para usuários
router.post("/usuarios", usuarioController.register); // Cadastro de usuário
router.post("/login", usuarioController.login); // Login de usuário
router.get("/usuarios", usuarioController.listarUsuarios); // Listar usuários

module.exports = router;

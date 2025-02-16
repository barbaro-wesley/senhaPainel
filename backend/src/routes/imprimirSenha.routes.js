const express = require("express");
const router = express.Router();
const imprimirSenhaController = require("../controllers/imprimirSenha.controller");

router.post("/", imprimirSenhaController.imprimirSenha);

module.exports = router;
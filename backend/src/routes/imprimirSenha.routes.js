const express = require("express");
const router = express.Router();
const {imprimirSenha} = require("../controllers/imprimirSenha.controller.js");
router.post("/imprimir-senha", imprimirSenha);

module.exports = router;

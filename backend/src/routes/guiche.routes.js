const express = require("express");
const { criarGuiche, listarGuiches, obterGuiche } = require("../controllers/guiche.controller");

const router = express.Router();

// Criar um novo guichê
router.post("/", criarGuiche);

// Listar todos os guichês
router.get("/", listarGuiches);

// Obter um guichê específico
router.get("/:id", obterGuiche);

module.exports = router;

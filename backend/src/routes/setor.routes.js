const express = require("express");
const { criarSetor, listarSetores, obterSetor } = require("../controllers/setor.controller");

const router = express.Router();

// Criar um novo setor
router.post("/", criarSetor);

// Listar todos os setores
router.get("/", listarSetores);

// Obter um setor específico
router.get("/:id", obterSetor);

module.exports = router;

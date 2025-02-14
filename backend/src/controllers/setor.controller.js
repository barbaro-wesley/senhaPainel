const prisma = require("../config/db");

// Criar um novo setor
exports.criarSetor = async (req, res) => {
  const { nome } = req.body;

  try {
    const setorExistente = await prisma.setor.findUnique({
      where: { nome },
    });

    if (setorExistente) {
      return res.status(400).json({ message: "Setor já existe" });
    }

    const novoSetor = await prisma.setor.create({
      data: {
        nome,
      },
    });

    res.status(201).json(novoSetor);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar setor" });
  }
};

// Listar todos os setores
exports.listarSetores = async (req, res) => {
  try {
    const setores = await prisma.setor.findMany();
    res.json(setores);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar setores" });
  }
};

// Obter um setor específico
exports.obterSetor = async (req, res) => {
  const { id } = req.params;

  try {
    const setor = await prisma.setor.findUnique({
      where: { id: parseInt(id) },
    });

    if (!setor) {
      return res.status(404).json({ message: "Setor não encontrado" });
    }

    res.json(setor);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter setor" });
  }
};

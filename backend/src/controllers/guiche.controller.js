const prisma = require("../config/db");

// Criar um novo guichê
exports.criarGuiche = async (req, res) => {
  const { numero, setorId } = req.body;

  try {
    const setor = await prisma.setor.findUnique({
      where: { id: setorId },
    });

    if (!setor) {
      return res.status(404).json({ message: "Setor não encontrado" });
    }

    const novoGuiche = await prisma.guiche.create({
      data: {
        numero,
        setorId,
      },
    });

    res.status(201).json(novoGuiche);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar guichê" });
  }
};

// Listar todos os guichês
exports.listarGuiches = async (req, res) => {
  try {
    const guiches = await prisma.guiche.findMany();
    res.json(guiches);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar guichês" });
  }
};

// Obter um guichê específico
exports.obterGuiche = async (req, res) => {
  const { id } = req.params;

  try {
    const guiche = await prisma.guiche.findUnique({
      where: { id: parseInt(id) },
    });

    if (!guiche) {
      return res.status(404).json({ message: "Guichê não encontrado" });
    }

    res.json(guiche);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter guichê" });
  }
};

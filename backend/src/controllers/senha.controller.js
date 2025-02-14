const prisma = require("../config/db");

exports.gerarSenha = async (req, res) => {
  const { setorId, tipo } = req.body;

  try {
    const totalSenhas = await prisma.senha.count({ where: { setorId } });
    const novaSenha = await prisma.senha.create({
      data: {
        numero: totalSenhas + 1,
        tipo,
        setorId,
      },
    });

    res.json(novaSenha);
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar senha" });
  }
};
exports.chamarSenha = async (req, res) => {
  const { id } = req.params;

  try {
    const senha = await prisma.senha.update({
      where: { id: parseInt(id) },
      data: { chamada: true },
    });

    res.json(senha);
  } catch (error) {
    res.status(500).json({ message: "Erro ao chamar senha" });
  }
};

const prisma = require("../config/db");

exports.gerarSenha = async (req, res) => {
  const { setorId, tipo } = req.body;

  try {
    // Busca o setor para obter o nome
    const setor = await prisma.setor.findUnique({
      where: { id: setorId },
    });

    if (!setor) {
      return res.status(404).json({ message: "Setor não encontrado" });
    }

    // Obtém a primeira letra do setor
    const primeiraLetraSetor = setor.nome.charAt(0).toUpperCase();

    // Obtém a primeira letra do tipo (Normal ou Prioritário)
    const primeiraLetraTipo = tipo.charAt(0).toUpperCase();

    // Conta o número de senhas já geradas para o setor
    const totalSenhas = await prisma.senha.count({ where: { setorId } });

    // Formata o número da senha com zeros à esquerda (ex: 001, 002, etc.)
    const numeroSenha = String(totalSenhas + 1).padStart(3, "0");

    // Cria a senha no formato desejado (ex: LN001, DP002, etc.)
    const numeroSenhaFormatado = `${primeiraLetraSetor}${primeiraLetraTipo}${numeroSenha}`;

    // Cria a senha no banco de dados
    const novaSenha = await prisma.senha.create({
      data: {
        numero: numeroSenhaFormatado, // Usa o número formatado
        tipo,
        setorId,
      },
    });

    res.json(novaSenha);
  } catch (error) {
    console.error("Erro ao gerar senha:", error);
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

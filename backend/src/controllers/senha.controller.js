const prisma = require("../config/db");
const { getIo } = require("../config/socket"); // Importe a função getIo

exports.gerarSenha = async (req, res) => {
  const { setorId, tipo } = req.body;

  // Garantir que o tipo seja "Prioritario" ou "Normal"
  const tipoFormatado = tipo === "Prioritario" ? "Prioritario" : "Normal";

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
    const primeiraLetraTipo = tipoFormatado.charAt(0).toUpperCase();

    // Conta o número de senhas já geradas para o setor
    const totalSenhas = await prisma.senha.count({ where: { setorId } });

    // Formata o número da senha com zeros à esquerda (ex: 001, 002, etc.)
    const numeroSenha = String(totalSenhas + 1).padStart(3, "0");

    // Cria a senha no formato desejado (ex: LN001, DP002, etc.)
    const numeroSenhaFormatado = `${primeiraLetraSetor}${primeiraLetraTipo}${numeroSenha}`;

    // Cria a senha no banco de dados
    const novaSenha = await prisma.senha.create({
      data: {
        numero: numeroSenhaFormatado,
        tipo: tipoFormatado, // Usa o tipo formatado
        setorId,
      },
    });

    // Emite evento de nova senha gerada
    const io = getIo(); // Obtém a instância do socket.io
    io.emit("novaSenha", novaSenha);

    res.json(novaSenha);
  } catch (error) {
    console.error("Erro ao gerar senha:", error);
    res.status(500).json({ message: "Erro ao gerar senha" });
  }
};

const chamarSenha = async (req, res) => {
  const { id } = req.body; // Recebe o ID da senha no corpo da requisição
  try {
    const senha = await prisma.senha.update({
      where: { id: parseInt(id) },
      data: { chamada: true, guicheId: req.user.guicheId }, // Atualiza a senha como chamada e associa ao guichê
    });

    // Emite o evento de senha chamada
    const io = getIo(); // Obtém a instância do socket.io
    io.emit("senhaChamada", senha); // Emite a senha chamada para todos os clientes

    res.json(senha);
  } catch (error) {
    res.status(500).json({ message: "Erro ao chamar senha" });
  }
};

exports.listarPendentes = async (req, res) => {
  const { setorId } = req.user;

  try {
    const senhas = await prisma.senha.findMany({
      where: {
        chamada: false,
        setorId: setorId,
      },
      orderBy: [
        { tipo: { sort: "desc", nulls: "last" } }, // Garantir prioridade das prioritárias
        { createdAt: "asc" }
      ],
    });
    res.json(senhas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar senhas pendentes" });
  }
};

exports.marcarDesistencia = async (req, res) => {
  const { id } = req.body;
  try {
    const senha = await prisma.senha.update({
      where: { id: parseInt(id) },
      data: { desistente: true }, // Marca a senha como desistente
    });
    res.json(senha);
  } catch (error) {
    res.status(500).json({ message: "Erro ao marcar desistência" });
  }
};
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

exports.chamarSenha = async (req, res) => {
  console.log("Dados do usuário:", req.user); // Debug

  const { guicheId } = req.user; // Obtém o guicheId do usuário logado
  const { id } = req.body; // ID da senha

  try {
    const senha = await prisma.senha.update({
      where: { id: parseInt(id) },
      data: {
        chamada: true, // Marca a senha como chamada
        guicheId: guicheId, // Associa ao guichê do usuário logado
      },
    });

    console.log("Senha atualizada:", senha); // Debug

    // Emite o evento de senha chamada via Socket.io
    const io = getIo();
    io.emit("senhaChamada", senha);

    res.json(senha);
  } catch (error) {
    console.error("Erro ao chamar senha:", error);
    res.status(500).json({ message: "Erro ao chamar senha", error: error.message });
  }
};

exports.listarPendentes = async (req, res) => {
  const { setorId } = req.user; // Obtém o setorId do usuário logado

  try {
    const senhas = await prisma.senha.findMany({
      where: {
        chamada: false, // Apenas senhas não chamadas
        setorId: setorId, // Filtra pelo setor do usuário logado
      },
      orderBy: [
        { tipo: "desc" }, // Prioriza senhas prioritárias
        { createdAt: "asc" }, // Ordena pela data de criação
      ],
    });

    res.json(senhas);
  } catch (error) {
    console.error("Erro ao listar senhas pendentes:", error);
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

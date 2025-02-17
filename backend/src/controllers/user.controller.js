const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authConfig = { secret: process.env.JWT_SECRET }; // Altere para um segredo mais seguro

// Criar um novo usuário
exports.register = async (req, res) => {
  const { nome, email, senha, setorId, guicheId } = req.body; // Adicionado guicheId

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, setorId, guicheId }, // Incluído guicheId
    });

    res.status(201).json({ message: "Usuário criado com sucesso", usuario });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário", details: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

    // Gera o token JWT com setorId e guicheId
    const token = jwt.sign(
      {
        id: usuario.id,
        setorId: usuario.setorId, // Inclui o setorId no token
        guicheId: usuario.guicheId, // Inclui o guicheId no token
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ message: "Login bem-sucedido", token, usuario });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login", details: error.message });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários", details: error.message });
  }
};

const prisma = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: usuario.id, setorId: usuario.setorId },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, setorId: usuario.setorId });
  } catch (error) {

    
    res.status(500).json({ message: "Erro ao autenticar usuário" });
  }
};

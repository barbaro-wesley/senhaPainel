const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Cabeçalho Authorization recebido:", authHeader); // Debug

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  // Extrai o token do cabeçalho (formato: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded); // Debug
    req.user = decoded; // Adiciona o usuário decodificado ao objeto `req`
    next(); // Passa para o próximo middleware ou rota
  } catch (error) {
    console.error("Erro ao verificar token:", error); // Debug
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;
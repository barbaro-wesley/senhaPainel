require("dotenv").config();
const express = require("express");
const cors = require("cors");
const escpos = require("escpos");
escpos.Network = require("escpos-network");
const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Importação das rotas
const authRoutes = require("./src/routes/auth.routes");
const setorRoutes = require("./src/routes/setor.routes");
const guicheRoutes = require("./src/routes/guiche.routes");
const senhaRoutes = require("./src/routes/senha.routes");
const usuarioRoutes = require("./src/routes/usuarios.routes");
const imprimirSenhaRoute = require("./src/routes/imprimirSenha.routes")

// Registro das rotas na aplicação
app.use("/api/auth", authRoutes);
app.use("/api/setores", setorRoutes);
app.use("/api/guiches", guicheRoutes);
app.use("/api/senhas", senhaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/imprimir-senha", imprimirSenhaRoute);

// Inicia o servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Configuração do Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Nova conexão Socket.io");

  socket.on("novaSenha", (senha) => {
    io.emit("senhaAtualizada", senha);
  });
});

app.post("/imprimir-senha", (req, res) => {
  const { numero, setor, tipo } = req.body;

  // Simulação de impressão: exibe no console
  console.log("=== Dados da Senha para Impressão ===");
  console.log(`Senha: ${numero}`);
  console.log(`Setor: ${setor}`);
  console.log(`Tipo: ${tipo}`);
  console.log("=====================================");

  // Simulação de impressão: salva em um arquivo de texto
  const dadosImpressao = `Senha: ${numero}\nSetor: ${setor}\nTipo: ${tipo}\n\n`;
  const caminhoArquivo = path.join(__dirname, "senhas_impressas.txt");

  fs.appendFile(caminhoArquivo, dadosImpressao, (error) => {
    if (error) {
      console.error("Erro ao salvar arquivo de simulação:", error);
      return res.status(500).json({ message: "Erro ao simular impressão" });
    }

    console.log("Dados da senha salvos em senhas_impressas.txt");
    res.json({ message: "Simulação de impressão realizada com sucesso" });
  });
});

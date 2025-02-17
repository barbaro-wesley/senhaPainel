require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initialize } = require("./src/config/socket"); // Importe a função initialize

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

// Registro das rotas na aplicação
app.use("/api/auth", authRoutes);
app.use("/api/setores", setorRoutes);
app.use("/api/guiches", guicheRoutes);
app.use("/api/senhas", senhaRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Inicializa o socket.io
initialize(server);
app.use(
  cors({
    origin: "http://localhost:5173", // Substitua pela origem do seu frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization", // Permite o cabeçalho Authorization
  })
);
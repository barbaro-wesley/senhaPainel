require("dotenv").config();
const express = require("express");
const cors = require("cors");

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
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

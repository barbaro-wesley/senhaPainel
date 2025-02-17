import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/usuarios/login", {
        email,
        senha,
      });
  
      const { token, usuario } = response.data;
  
      // Salvar o token e o usuário no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario)); // Inclui o setorId
  
      // Configurar o Axios para enviar o token no cabeçalho das requisições
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      // Redirecionar para o painel do recepcionista
      navigate("/recepcionista");
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error("Erro ao fazer login", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField 
        fullWidth 
        label="Email" 
        variant="outlined" 
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField 
        fullWidth 
        label="Senha" 
        variant="outlined" 
        type="password"
        margin="normal"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <Button 
        fullWidth 
        variant="contained" 
        color="primary" 
        onClick={handleLogin} 
        style={{ marginTop: 20 }}
      >
        Entrar
      </Button>
    </Container>
  );
};

export default Login;
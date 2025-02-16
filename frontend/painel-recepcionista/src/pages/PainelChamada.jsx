import React, { useState, useEffect } from "react";
import { Typography, Box, List, ListItem, ListItemText, styled } from "@mui/material";
import io from "socket.io-client";

const Fundo = styled(Box)({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#001B3A", // Fundo azul escuro
  position: "fixed",
  top: 0,
  left: 0,
  overflow: "hidden",
  textAlign: "center",
  padding: "20px",
});

const PainelChamada = () => {
  const [senhaAtual, setSenhaAtual] = useState(null); // Senha chamada no momento
  const [historico, setHistorico] = useState([]); // Histórico de senhas chamadas
  const [socket, setSocket] = useState(null); // Conexão com o socket.io

  // Efeito para conectar ao socket.io
  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Conecta ao servidor socket.io
    setSocket(newSocket);

    // Recebe atualizações de senhas chamadas
    newSocket.on("senhaChamada", (senha) => {
      console.log("Senha recebida:", senha); // Depuração
      setSenhaAtual(senha); // Atualiza a senha atual
      setHistorico((prev) => [senha, ...prev].slice(0, 5)); // Adiciona ao histórico (limite de 5)
      falarSenha(senha); // Anuncia a senha por voz
    });

    // Limpeza ao desmontar o componente
    return () => newSocket.close();
  }, []);

  // Função para anunciar a senha por voz
  const falarSenha = (senha) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      `Senha ${senha.numero}, dirija-se ao guichê ${senha.guicheId}`
    );
    synth.speak(utterance);
  };

  return (
    <Fundo>
      {/* Título do painel */}
      <Typography variant="h3" gutterBottom style={{ color: "#fff", fontWeight: "bold" }}>
        Painel de Chamada
      </Typography>

      {/* Exibição da senha atual */}
      {senhaAtual && (
        <Box
          style={{
            background: "#FFDD00",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h2" style={{ color: "#001B3A", fontWeight: "bold" }}>
            Senha: {senhaAtual.numero}
          </Typography>
          <Typography variant="h4" style={{ color: "#001B3A" }}>
            Guichê: {senhaAtual.guicheId}
          </Typography>
        </Box>
      )}

      {/* Histórico de senhas chamadas */}
      <Typography variant="h5" style={{ color: "#fff", marginBottom: "10px" }}>
        Histórico de Chamadas:
      </Typography>
      <List style={{ width: "100%", maxWidth: "400px" }}>
        {historico.map((senha, index) => (
          <ListItem
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <ListItemText
              primary={`Senha: ${senha.numero}`}
              secondary={`Guichê: ${senha.guicheId}`}
              style={{ fontSize: "1.2em" }}
            />
          </ListItem>
        ))}
      </List>
    </Fundo>
  );
};

export default PainelChamada;
import React, { useState, useEffect } from "react";
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled } from "@mui/material";
import io from "socket.io-client";

const Fundo = styled(Box)({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#001B3A",
  position: "fixed",
  top: 0,
  left: 0,
  overflow: "hidden",
  textAlign: "center",
  padding: "20px",
});

const PainelChamada = () => {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("senhaChamada", (senha) => {
      setSenhaAtual(senha);
      setHistorico((prev) => [senha, ...prev].slice(0, 5));
      falarSenha(senha);
    });

    return () => newSocket.close();
  }, []);

  const falarSenha = (senha) => {
    const synth = window.speechSynthesis;
  
    // Verifica se a API está disponível
    if (!synth) {
      console.error("API de síntese de voz não suportada.");
      return;
    }
  
    // Cria a instância do SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(
      `Senha ${senha.numero}, dirija-se ao guichê ${senha.guicheId}`
    );
  
    // Configura a voz (opcional)
    const voices = synth.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0]; // Use a primeira voz disponível
    }
  
    // Configura o volume, taxa e tom (opcional)
    utterance.volume = 1; // Volume máximo (0 a 1)
    utterance.rate = 1; // Velocidade normal (0.1 a 10)
    utterance.pitch = 1; // Tom normal (0 a 2)
  
    // Fala a senha
    synth.speak(utterance);
  
    // Logs para depuração
    utterance.onstart = () => {
      console.log("Iniciando fala...");
    };
  
    utterance.onend = () => {
      console.log("Fala concluída.");
    };
  
    utterance.onerror = (error) => {
      console.error("Erro ao falar:", error);
    };
  };

  return (
    <Fundo>
      <Typography variant="h3" gutterBottom style={{ color: "#fff", fontWeight: "bold" }}>
        Painel de Chamada
      </Typography>

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

      <Typography variant="h5" style={{ color: "#fff", marginBottom: "10px" }}>
        Histórico de Chamadas:
      </Typography>

      <TableContainer component={Paper} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#001B3A" }}>Senha</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#001B3A" }}>Guichê</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historico.map((senha, index) => (
              <TableRow key={index}>
                <TableCell style={{ color: "#001B3A" }}>{senha.numero}</TableCell>
                <TableCell style={{ color: "#001B3A" }}>{senha.guicheId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fundo>
  );
};

export default PainelChamada;
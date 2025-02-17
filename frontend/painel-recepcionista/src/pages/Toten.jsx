import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import api from "../services/api";
import logo from "../assets/logo.png";
import { io } from "socket.io-client";

const setores = [
  { id: 1, nome: "Laboratório", cor: "#00509E" },
  { id: 2, nome: "Diagnóstico", cor: "#003F7D" },
  { id: 3, nome: "Consultas", cor: "#002B5B" }
];

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

const AnimacaoFundo = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  "& div": {
    position: "absolute",
    background: "rgba(255, 255, 255, 0.1)",
    animation: "aparecerDesaparecer 3s infinite ease-in-out",
  },
  "@keyframes aparecerDesaparecer": {
    "0%": { opacity: 0 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0 },
  }
});

const BotaoSetor = styled(Button)({
  width: "100%",
  maxWidth: "400px",
  fontSize: "1.8em",
  fontWeight: "bold",
  padding: "15px 0",
  margin: "10px 0",
  color: "#fff",
  background: "rgba(255, 255, 255, 0.1)",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  '&:hover': {
    background: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.05)"
  },
});

const Toten = () => {
  const [etapa, setEtapa] = useState("setor");
  const [setorSelecionado, setSetorSelecionado] = useState(null);
  const [senhaGerada, setSenhaGerada] = useState(null);
  const [formas, setFormas] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const novasFormas = [];
    for (let i = 0; i < 10; i++) {
      novasFormas.push({
        top: Math.random() * 100 + "vh",
        left: Math.random() * 100 + "vw",
        width: Math.random() * 100 + 50 + "px",
        height: "2px",
        animationDelay: Math.random() * 5 + "s"
      });

      novasFormas.push({
        top: Math.random() * 100 + "vh",
        left: Math.random() * 100 + "vw",
        width: "2px",
        height: Math.random() * 100 + 50 + "px",
        animationDelay: Math.random() * 5 + "s"
      });
    }
    setFormas(novasFormas);

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (senhaGerada) {
      const timer = setTimeout(() => {
        setSenhaGerada(null); // Remove a senha da tela após 10 segundos
      }, 10000); // 10 segundos

      return () => clearTimeout(timer);
    }
  }, [senhaGerada]);

  const selecionarSetor = (setor) => {
    setSetorSelecionado(setor);
    setEtapa("tipo");
  };

  const imprimirSenha = async (senha) => {
    try {
      const response = await api.post("http://localhost:5000/api/imprimir-senha/imprimir-senha", {
        numero: senha.numero,
        setor: setorSelecionado.nome,
        tipo: senha.tipo,
      });
  
      if (response.data.message === "Senha impressa com sucesso") {
        console.log("Senha impressa com sucesso");
      }
    } catch (error) {
      console.error("Erro ao imprimir senha:", error);
    }
  };
  

  const gerarSenha = async (prioridade) => {
    try {
      console.log("Tentando gerar senha para setor:", setorSelecionado.id, "tipo:", prioridade); // Debug
  
      // Corrigindo o valor do tipo para "Prioritario" (sem acento)
      const tipoFormatado = prioridade === "Prioritário" ? "Prioritario" : "Normal";
  
      const response = await api.post("/senhas/gerar", {
        setorId: setorSelecionado.id,
        tipo: tipoFormatado, // Usando o tipo formatado
      });
  
      console.log("Resposta da API:", response.data); // Debug
      setSenhaGerada(response.data);
      falarSenha(response.data.numero);
      await imprimirSenha(response.data);
  
      if (socket) {
        socket.emit("novaSenha", response.data);
      }
      setEtapa("setor");
    } catch (error) {
      console.error("Erro ao gerar senha", error);
    }
  };

  const falarSenha = (numero) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(`Senha gerada: ${numero}`);
    synth.speak(utterance);
  };

  return (
    <Fundo>
      <AnimacaoFundo>
        {formas.map((forma, index) => (
          <div
            key={index}
            style={{
              top: forma.top,
              left: forma.left,
              width: forma.width,
              height: forma.height,
              animationDelay: forma.animationDelay,
            }}
          />
        ))}
      </AnimacaoFundo>

      <img src={logo} alt="Logo HCR" style={{ width: "200px", marginBottom: "20px" }} />
      <Typography variant="h3" gutterBottom color="white" fontWeight="bold">Sejam Bem-vindos</Typography>
      
      {etapa === "setor" && (
        <>
          <Typography variant="h5" gutterBottom color="white">Escolha um setor de atendimento</Typography>
          {setores.map((setor) => (
            <BotaoSetor key={setor.nome} onClick={() => selecionarSetor(setor)}>
              {setor.nome}
            </BotaoSetor>
          ))}
        </>
      )}

      {etapa === "tipo" && (
        <>
          <Typography variant="h5" gutterBottom color="white">Escolha o tipo de atendimento</Typography>
          <BotaoSetor onClick={() => gerarSenha("Normal")} style={{ backgroundColor: "#00509E" }}>Convencional</BotaoSetor>
          <BotaoSetor onClick={() => gerarSenha("Prioritário")} style={{ backgroundColor: "#0084FF" }}>Preferencial</BotaoSetor>
        </>
      )}

      {senhaGerada && (
        <Typography variant="h4" style={{ marginTop: 20, fontWeight: "bold", color: "#FFDD00", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}>
          Senha Gerada: {senhaGerada.numero}
        </Typography>
      )}
    </Fundo>
  );
};

export default Toten;
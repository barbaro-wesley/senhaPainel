import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import api from "../services/api";
import logo from "../assets/logo.png";

const setores = [
  { nome: "Laboratório", cor: "#00509E" },
  { nome: "Diagnóstico", cor: "#003F7D" },
  { nome: "Consultas", cor: "#002B5B" }
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
    animation: "aparecerDesaparecer 5s infinite ease-in-out",
  },
  "@keyframes aparecerDesaparecer": {
    "0%": { opacity: 0, transform: "scale(0.5)" },
    "50%": { opacity: 1, transform: "scale(1)" },
    "100%": { opacity: 0, transform: "scale(0.5)" },
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

const Totem = () => {
  const [etapa, setEtapa] = useState("setor");
  const [setorSelecionado, setSetorSelecionado] = useState(null);
  const [senhaGerada, setSenhaGerada] = useState(null);
  const [formas, setFormas] = useState([]);

  useEffect(() => {
    const formasGeometricas = [];
    for (let i = 0; i < 20; i++) {
      const tipo = Math.floor(Math.random() * 3); // 0: círculo, 1: quadrado, 2: triângulo
      const tamanho = Math.random() * 100 + 50; // Tamanho entre 50px e 150px
      const top = Math.random() * 100 + "vh";
      const left = Math.random() * 100 + "vw";
      const animationDelay = Math.random() * 5 + "s";

      formasGeometricas.push({
        tipo,
        top,
        left,
        width: tamanho + "px",
        height: tamanho + "px",
        animationDelay,
      });
    }
    setFormas(formasGeometricas);
  }, []);

  const selecionarSetor = (setor) => {
    setSetorSelecionado(setor);
    setEtapa("tipo");
  };

  const gerarSenha = async (prioridade) => {
    try {
      const response = await api.post("/senhas/gerar", {
        setor: setorSelecionado,
        prioridade,
      });
      setSenhaGerada(response.data);
      falarSenha(response.data.numero);
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
              borderRadius: forma.tipo === 0 ? "50%" : forma.tipo === 1 ? "0%" : "0%", // Círculo ou quadrado
              clipPath: forma.tipo === 2 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none", // Triângulo
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
            <BotaoSetor key={setor.nome} onClick={() => selecionarSetor(setor.nome)}>{setor.nome}</BotaoSetor>
          ))}
        </>
      )}

      {etapa === "tipo" && (
        <>
          <Typography variant="h5" gutterBottom color="white">Escolha o tipo de atendimento</Typography>
          <BotaoSetor onClick={() => gerarSenha("Normal")} style={{ backgroundColor: "#00509E" }}>Normal</BotaoSetor>
          <BotaoSetor onClick={() => gerarSenha("Prioritário")} style={{ backgroundColor: "#0084FF" }}>Prioritário</BotaoSetor>
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

export default Totem;
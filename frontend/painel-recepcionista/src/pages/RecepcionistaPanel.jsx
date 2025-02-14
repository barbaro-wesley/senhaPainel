import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import api from "../services/api";
import io from "socket.io-client";
import PainelHeader from "../Componets/Panelheader";
import SenhaLista from "../Componets/SenhaLista";
import BotaoChamar from "../Componets/BotaoChamar";
import ModalDesistencia from "../Componets/ModalDesistencia";

const socket = io("http://localhost:5000");

const PainelRecepcao = () => {
  const [senhas, setSenhas] = useState([]);
  const [ultimaChamada, setUltimaChamada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarSenhas();
    socket.on("senhaAtualizada", carregarSenhas);
  }, []);

  const carregarSenhas = async () => {
    const response = await api.get("/senhas/pendentes");
    setSenhas(response.data);
  };

  const chamarSenha = async () => {
    if (senhas.length === 0) return;
    const response = await api.post("/senhas/chamar", { id: senhas[0].id });
    setUltimaChamada(response.data);
    carregarSenhas();
  };

  return (
    <Container>
      <PainelHeader />
      <Typography variant="h4" gutterBottom align="center">
        Painel da Recepção
      </Typography>
      <Grid container spacing={3}>
        <SenhaLista senhas={senhas} ultimaChamada={ultimaChamada} />
      </Grid>
      <BotaoChamar chamarSenha={chamarSenha} />
      <ModalDesistencia 
        aberto={modalAberto} 
        onClose={() => setModalAberto(false)}
        onConfirm={() => { /* lógica de desistência */ }}
      />
    </Container>
  );
};

export default PainelRecepcao;

// src/pages/PainelRecepcao.jsx - Tela principal do painel
import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import api from "../services/api";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const PainelRecepcao = () => {
  const [senhas, setSenhas] = useState([]);
  const [ultimaChamada, setUltimaChamada] = useState(null);
  const [openDesistencia, setOpenDesistencia] = useState(false);
  const [senhaSelecionada, setSenhaSelecionada] = useState(null);

  useEffect(() => {
    carregarSenhas();
    socket.on("senhaAtualizada", carregarSenhas);
  
    // Ouvir novas senhas geradas pelo Totem
    socket.on("novaSenha", (novaSenha) => {
      setSenhas((prevSenhas) => [...prevSenhas, novaSenha]);
    });
  
    return () => {
      socket.off("senhaAtualizada");
      socket.off("novaSenha");
    };
  }, []);

  const carregarSenhas = async () => {
    const response = await api.get("/senhas/pendentes");
    setSenhas(response.data);
  };

  const chamarSenha = async () => {
    if (senhas.length === 0) return;
    const response = await api.post("/senhas/chamar", { id: senhas[0].id });
    setUltimaChamada(response.data);
    falarSenha(response.data.numero);
    carregarSenhas();
  };

  const repetirSenha = () => {
    if (ultimaChamada) {
      falarSenha(ultimaChamada.numero);
    }
  };

  const falarSenha = (numero) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(`Senha ${numero}`);
    synth.speak(utterance);
  };

  const abrirModalDesistencia = (senha) => {
    setSenhaSelecionada(senha);
    setOpenDesistencia(true);
  };

  const confirmarDesistencia = async () => {
    if (senhaSelecionada) {
      await api.post("/senhas/desistir", { id: senhaSelecionada.id });
      setOpenDesistencia(false);
      carregarSenhas();
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">Painel da Recepção</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Senhas na Fila</Typography>
              <Typography variant="h4">{senhas.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Última Chamada</Typography>
              <Typography variant="h4">{ultimaChamada?.numero || "Nenhuma"}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" fullWidth onClick={chamarSenha} style={{ marginTop: 20 }}>
        Chamar Próxima Senha
      </Button>
      <Button variant="contained" color="secondary" fullWidth onClick={repetirSenha} style={{ marginTop: 10 }}>
        Repetir Última Senha
      </Button>
      <Typography variant="h6" mt={3}>Senhas na Fila:</Typography>
      <List>
        {senhas.map((senha) => (
          <ListItem key={senha.id} divider>
            <ListItemText primary={`Senha: ${senha.numero}`} />
            <Button variant="contained" color="error" onClick={() => abrirModalDesistencia(senha)}>
              Desistência
            </Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={openDesistencia} onClose={() => setOpenDesistencia(false)}>
        <DialogTitle>Confirmar Desistência</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja marcar essa senha como desistente?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDesistencia(false)} color="primary">Cancelar</Button>
          <Button onClick={confirmarDesistencia} color="secondary">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PainelRecepcao;

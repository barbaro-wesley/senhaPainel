import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  styled,
} from "@mui/material";
import api from "../services/api";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Fundo = styled(Box)({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  background: "#001B3A", // Fundo azul escuro original
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
    background: "rgba(255, 255, 255, 0.1)", // Ajuste para fundo azul escuro
    animation: "aparecerDesaparecer 3s infinite ease-in-out",
  },
  "@keyframes aparecerDesaparecer": {
    "0%": { opacity: 0 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0 },
  },
});

const PainelRecepcao = () => {
  const [senhas, setSenhas] = useState([]);
  const [ultimaChamada, setUltimaChamada] = useState(null);
  const [openDesistencia, setOpenDesistencia] = useState(false);
  const [senhaSelecionada, setSenhaSelecionada] = useState(null);
  const [historicoChamadas, setHistoricoChamadas] = useState([]);
  const [formas, setFormas] = useState([]);

  // Função para ordenar as senhas (prioritárias primeiro)
  const ordenarSenhas = (senhas) => {
    return senhas.sort((a, b) => {
      if (a.tipo === "Prioritario" && b.tipo !== "Prioritario") return -1;
      if (a.tipo !== "Prioritario" && b.tipo === "Prioritario") return 1;
      return a.id - b.id; // Ordena sempre pela ordem de criação (mais recente primeiro)
    });
  };

  useEffect(() => {
    carregarSenhas();
    socket.on("senhaAtualizada", carregarSenhas);
    socket.on("novaSenha", (novaSenha) => {
      setSenhas((prevSenhas) => {
        const novasSenhas = [...prevSenhas, novaSenha];
        return ordenarSenhas(novasSenhas);
      });
    });

    // Configurar animação de fundo
    const novasFormas = [];
    for (let i = 0; i < 10; i++) {
      novasFormas.push({
        top: Math.random() * 100 + "vh",
        left: Math.random() * 100 + "vw",
        width: Math.random() * 100 + 50 + "px",
        height: "2px",
        animationDelay: Math.random() * 5 + "s",
      });
      novasFormas.push({
        top: Math.random() * 100 + "vh",
        left: Math.random() * 100 + "vw",
        width: "2px",
        height: Math.random() * 100 + 50 + "px",
        animationDelay: Math.random() * 5 + "s",
      });
    }
    setFormas(novasFormas);

    return () => {
      socket.off("senhaAtualizada");
      socket.off("novaSenha");
    };
  }, []);

  const carregarSenhas = async () => {
    try {
      const response = await api.get("/senhas/pendentes");
      const senhasOrdenadas = ordenarSenhas(response.data);
      setSenhas(senhasOrdenadas);
      console.log("Senhas carregadas e ordenadas:", senhasOrdenadas); // Depuração
    } catch (error) {
      console.error("Erro ao carregar senhas:", error);
    }
  };

  const chamarSenha = async (senha) => {
    try {
      const response = await api.post("/senhas/chamar", { id: senha.id });
      setUltimaChamada(response.data);
      setHistoricoChamadas((prev) => [response.data, ...prev].slice(0, 5));
      setSenhas((prevSenhas) => {
        const novasSenhas = prevSenhas.filter((s) => s.id !== response.data.id);
        return ordenarSenhas(novasSenhas);
      });
    } catch (error) {
      console.error("Erro ao chamar senha:", error);
    }
  };

  const chamarSenhaNovamente = async (senha) => {
    try {
      const response = await api.post("/senhas/chamar", { id: senha.id });
      setUltimaChamada(response.data);
      setHistoricoChamadas((prev) => [response.data, ...prev].slice(0, 5));
    } catch (error) {
      console.error("Erro ao chamar senha novamente:", error);
    }
  };

  const abrirModalDesistencia = (senha) => {
    setSenhaSelecionada(senha);
    setOpenDesistencia(true);
  };

  const confirmarDesistencia = async () => {
    if (senhaSelecionada) {
      try {
        await api.post("/senhas/desistir", { id: senhaSelecionada.id });
        setOpenDesistencia(false);
        setHistoricoChamadas((prev) => prev.filter((s) => s.id !== senhaSelecionada.id));
      } catch (error) {
        console.error("Erro ao confirmar desistência:", error);
      }
    }
  };

  // Função para remover acentos
  const removerAcentos = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrar senhas prioritárias e normais
  const senhasPrioritarias = senhas.filter(
    (senha) => removerAcentos(senha.tipo.toLowerCase()) === "prioritario"
  );
  const senhasNormais = senhas.filter(
    (senha) => removerAcentos(senha.tipo.toLowerCase()) !== "prioritario"
  );

  console.log("Senhas Prioritárias:", senhasPrioritarias); // Depuração
  console.log("Senhas Normais:", senhasNormais); // Depuração

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

      <Typography variant="h5" gutterBottom style={{ color: "#fff", marginBottom: "20px" }}>
        Painel da Recepção
      </Typography>

      <Grid container spacing={3} style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ background: "rgba(255, 255, 255, 0.1)", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Senhas na Fila</Typography>
              <Typography variant="h4">{senhas.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ background: "rgba(255, 255, 255, 0.1)", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Última Chamada</Typography>
              <Typography variant="h4">{ultimaChamada?.numero || "Nenhuma"}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ width: "100%", maxWidth: "1200px", margin: "20px auto" }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" style={{ color: "#fff", marginBottom: "10px" }}>
            Senhas Prioritárias:
          </Typography>
          <List>
            {senhasPrioritarias.map((senha) => (
              <ListItem
                key={senha.id}
                divider
                style={{
                  background: "#FF5733", // Cor de fundo para senhas prioritárias
                  color: "#fff",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <ListItemText
                  primary={`Senha: ${senha.numero}`}
                  secondary={`Tipo: ${senha.tipo}`}
                  style={{ fontSize: "1.2em" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => chamarSenha(senha)}
                  style={{ marginLeft: "10px", background: "#00509E", color: "#fff" }}
                >
                  Chamar
                </Button>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" style={{ color: "#fff", marginTop: "20px", marginBottom: "10px" }}>
            Senhas Normais:
          </Typography>
          <List>
            {senhasNormais.map((senha) => (
              <ListItem
                key={senha.id}
                divider
                style={{
                  background: "rgba(255, 255, 255, 0.1)", // Cor de fundo para senhas normais
                  color: "#fff",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <ListItemText
                  primary={`Senha: ${senha.numero}`}
                  secondary={`Tipo: ${senha.tipo}`}
                  style={{ fontSize: "1.2em" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => chamarSenha(senha)}
                  style={{ marginLeft: "10px", background: "#00509E", color: "#fff" }}
                >
                  Chamar
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" style={{ color: "#fff" }}>
            Histórico de Chamadas:
          </Typography>
          <List>
            {historicoChamadas.map((senha) => (
              <ListItem
                key={senha.id}
                divider
                style={{ background: "rgba(255, 255, 255, 0.1)", color: "#fff", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
              >
                <ListItemText
                  primary={`Senha: ${senha.numero}`}
                  secondary={`Tipo: ${senha.tipo}`}
                  style={{ fontSize: "1.2em" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => chamarSenhaNovamente(senha)}
                  style={{ marginRight: "10px", background: "#00509E", color: "#fff" }}
                >
                  Chamar Novamente
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => abrirModalDesistencia(senha)}
                  style={{ background: "#FF4444", color: "#fff" }}
                >
                  Desistência
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Dialog open={openDesistencia} onClose={() => setOpenDesistencia(false)}>
        <DialogTitle style={{ color: "#000" }}>Confirmar Desistência</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "#000" }}>
            Tem certeza que deseja marcar essa senha como desistente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDesistencia(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmarDesistencia} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes pulsar {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Fundo>
  );
};

export default PainelRecepcao;
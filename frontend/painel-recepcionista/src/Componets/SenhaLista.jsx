import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const SenhaLista = ({ senhas }) => {
  return (
    <>
      <Typography variant="h6">Senhas na Fila:</Typography>
      <List>
        {senhas.map((senha) => (
          <ListItem key={senha.id} divider>
            <ListItemText primary={`Senha: ${senha.numero}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SenhaLista;
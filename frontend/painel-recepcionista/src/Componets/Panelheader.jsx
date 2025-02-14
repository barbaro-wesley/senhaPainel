import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const PainelHeader = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Painel da Recepção</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default PainelHeader;
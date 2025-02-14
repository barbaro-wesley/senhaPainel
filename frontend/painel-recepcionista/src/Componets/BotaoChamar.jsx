import React from "react";
import { Button } from "@mui/material";

const BotaoChamar = ({ chamarSenha, repetirSenha, ultimaChamada }) => {
  return (
    <>
      <Button variant="contained" color="primary" fullWidth onClick={chamarSenha}>
        Chamar Próxima Senha
      </Button>
      {ultimaChamada && (
        <Button variant="outlined" color="secondary" fullWidth onClick={repetirSenha} style={{ marginTop: 10 }}>
          Repetir Última Chamada
        </Button>
      )}
    </>
  );
};

export default BotaoChamar;
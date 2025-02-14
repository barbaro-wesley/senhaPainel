// ModalDesistencia.jsx - Modal para confirmação de desistência
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ModalDesistencia = ({ open, handleClose, confirmarDesistencia }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 3, backgroundColor: "white", margin: "auto", width: 300, mt: 10, borderRadius: 2 }}>
        <Typography variant="h6">Confirmar Desistência</Typography>
        <Typography>Deseja marcar essa senha como desistente?</Typography>
        <Button variant="contained" color="error" fullWidth onClick={confirmarDesistencia} style={{ marginTop: 10 }}>
          Confirmar
        </Button>
        <Button variant="outlined" fullWidth onClick={handleClose} style={{ marginTop: 10 }}>
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalDesistencia;

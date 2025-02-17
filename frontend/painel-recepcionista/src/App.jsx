import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // ✅ Importar Navigate

import Login from "./pages/Login";
import Recepcionista from "./pages/RecepcionistaPanel";
import Toten from "./pages/Toten";
import PainelChamada from "./pages/PainelChamada";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/toten" element={<Toten />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/recepcionista" element={<Recepcionista />} />
        <Route path="/painel" element={<PainelChamada />} /> 
        <Route path="*" element={<Navigate to="/" />} /> {/* Redireciona rotas inválidas */}
      </Routes>
    </Router>
  );
}

export default App;

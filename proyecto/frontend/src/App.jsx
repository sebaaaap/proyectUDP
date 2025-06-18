// import { Approuter } from "./router/Approuter";
// import './index.css';
// function App() {
//   return <Approuter />
// }
//
// export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "../src/Paginas/HomeV2.jsx";
import CrearProyecto from "../src/Paginas/CrearProyecto.jsx";
import CompletarPerfilEstudiante from "./Paginas/CompletarPerfilEstudiante.jsx";
import CompletarPerfilProfesor from "./Paginas/CompletarPerfilProfesor.jsx";

function App() {

  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/crear-proyecto" element={<CrearProyecto />} />
        <Route path="/completar-perfil-estudiante" element={<CompletarPerfilEstudiante /> } />
        <Route path="/completar-perfil-profesor" element={<CompletarPerfilProfesor /> } />

        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
                <h1 className="text-2xl font-bold mb-4">Bienvenido a mi app</h1>
                <p className="mb-6">Inicia sesión con tu correo institucional</p>
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow"
                >
                  Iniciar sesión con Google
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

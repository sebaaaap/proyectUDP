// import { Approuter } from "./router/Approuter";
// import './index.css';
// function App() {
//   return <Approuter />
// }
//
// export default App;

import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../src/Paginas/HomeV2.jsx";
import CrearProyecto from "../src/Paginas/CrearProyecto.jsx";
import CompletarPerfilEstudiante from "./Paginas/CompletarPerfilEstudiante.jsx";
import CompletarPerfilProfesor from "./Paginas/CompletarPerfilProfesor.jsx";
import { DashboardProfe } from "./Paginas/Dashboard-profe.jsx";
import { DashboardEstudiante } from "./Paginas/Dashboard-estudiante.jsx";
import PruebaNavbar from "./PruebaNavbar.jsx";
import { Callback } from "./callback.jsx";
import { MisProyectosEstudiante } from "./Paginas/MisProyectosEstudiante";
import RankingProyectos from "./Paginas/RankingProyectos";
import { Login } from "./Paginas/Login.jsx";

// Layout con Navbar
function LayoutWithNavbar() {
  return (
    <>
      <PruebaNavbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/crear-proyecto" element={<CrearProyecto />} />
        <Route path="/dashboard-profe" element={<DashboardProfe />} />
        <Route path="/mis-proyectos" element={<MisProyectosEstudiante />} />
        <Route path="/dashboard-estudiante" element={<DashboardEstudiante />} />
        <Route path="/ranking" element={<RankingProyectos />} />
        <Route path="/completar-perfil-estudiante" element={<CompletarPerfilEstudiante />} />
        <Route path="/completar-perfil-profesor" element={<CompletarPerfilProfesor />} />
        {/* Aquí puedes agregar más rutas que SÍ deben tener navbar */}
      </Routes>
    </>
  );
}

// Componente para la página principal (sin navbar)
function MainPage() {
  return <Login />;
}

function App() {
  return (
    <Routes>
      {/* Rutas sin Navbar (páginas de completar perfil y main) */}
      <Route path="/completar-perfil-estudiante" element={<CompletarPerfilEstudiante />} />
      <Route path="/completar-perfil-profesor" element={<CompletarPerfilProfesor />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/callback" element={<Callback />} />
      
      {/* Rutas con Navbar (todas las demás) */}
      <Route path="/*" element={<LayoutWithNavbar />} />
    </Routes>
  );
}

export default App;

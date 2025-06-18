import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const irACrear = () => {
    navigate("/crear-proyecto");
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:8000/logout";
  };

  useEffect(() => {
  fetch("http://localhost:8000/me", {
    method: "GET",
    credentials: "include", // Importante para cookies
  })
    .then((res) => {
      if (res.status === 401) {
        navigate("/"); // No autenticado → ir al inicio
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data) setUsuario(data); // Guardar usuario, sin verificar perfil
    })
    .catch(() => navigate("/")); // Cualquier error → bienvenida
}, [navigate]);

  if (!usuario) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Hola {usuario.nombre} {usuario.apellido}
      </h1>
      <p className="text-sm text-gray-600">Rol: {usuario.rol}</p>

      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={irACrear}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          Crear Proyecto
        </button>

        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Home;

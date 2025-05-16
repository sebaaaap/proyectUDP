import { Route, Routes } from "react-router-dom"; // Asegúrate de usar react-router-dom
import PruebaNavbar from "../PruebaNavbar";
import { Login, Registrar, Home, ProyectoForm } from "../Paginas"; // Asegúrate de que "Home" esté correctamente exportado

export const Approuter = () => {
    return (
        <Routes>
            {/* Define PruebaNavbar como el componente padre */}
            <Route path="/" element={<PruebaNavbar />}>
                {/* Rutas hijas */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="registrar" element={<Registrar />} />
                <Route path="proyecto-form" element={<ProyectoForm />} />
            </Route>
        </Routes>
    );
};
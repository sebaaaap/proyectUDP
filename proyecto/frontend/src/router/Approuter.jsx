import { Route, Routes } from "react-router-dom";
import PruebaNavbar from "../PruebaNavbar";
import { Login, Registrar, Home, ProyectoForm} from "../Paginas";
import { DashboardProfe } from "../Paginas/Dashboard-profe"; // Importa tu dashboard de profesor
import { DashboardEstudiante } from "../Paginas/Dashboard-estudiante"; // Importa tu dashboard de estudiante

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
                <Route path="dashboard-profe" element={<DashboardProfe />} /> {/* Ruta para el dashboard del profesor */}
                <Route path="dashboard-estudiante" element={<DashboardEstudiante />} /> {/* Ruta para el dashboard del estudiante */}
            </Route>
        </Routes>
    );
};
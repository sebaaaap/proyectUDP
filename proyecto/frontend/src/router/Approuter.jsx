import { Route, Routes } from "react-router-dom";
import PruebaNavbar from "../PruebaNavbar";
import { Login, Registrar, Home, ProyectoForm} from "../Paginas";
import { DashboardProfe } from "../Paginas/Dashboard-profe"; 
import { DashboardEstudiante } from "../Paginas/Dashboard-estudiante"; 

export const Approuter = () => {
    return (
        <Routes>
            <Route path="/" element={<PruebaNavbar />}>
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
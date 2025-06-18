import { Route, Routes } from "react-router-dom";
import PruebaNavbar from "../PruebaNavbar";
import { Login, Registrar, Home, ProyectoForm} from "../Paginas";
import { DashboardProfe } from "../Paginas/Dashboard-profe"; 
import { DashboardEstudiante } from "../Paginas/Dashboard-estudiante"; 
import { MisProyectosEstudiante } from "../Paginas/MisProyectosEstudiante";

export const Approuter = () => {
    return (
        <Routes>
            <Route path="/" element={<PruebaNavbar />}>
                <Route index element={<Home />} />
                <Route path="registrar" element={<Registrar />} />
                <Route path="proyecto-form" element={<ProyectoForm />} />
                <Route path="dashboard-profe" element={<DashboardProfe />} /> 
                <Route path="dashboard-estudiante" element={<DashboardEstudiante />} /> 
                <Route path="mis-proyectos" element={<MisProyectosEstudiante />} /> 
            </Route>
                            <Route path="/login" element={<Login />} />

        </Routes>
    );
};
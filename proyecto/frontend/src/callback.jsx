// src/Paginas/Callback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export function Callback() {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        const token = hash.substring(hash.indexOf('token=') + 6);
        
        if (token) {
            login(token); // Guarda el token en el contexto de autenticación
            navigate('/home');
        } else {
            navigate('/login?error=no_token');
        }
    }, [login, navigate]);

    return <div>Procesando autenticación...</div>;
}
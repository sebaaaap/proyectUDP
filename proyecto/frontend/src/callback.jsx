// Callback.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

export const Callback = () => {
    const location = useLocation();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.hash.substring(1));
        const token = params.get('token');

        if (token) {
            login(token);
        } else {
            navigate('/');
        }
    }, [location, login, navigate]);

    return <div>Cargando...</div>;
};
// Login.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// src/Paginas/Login.jsx
import { useAuth } from '../context/AuthContext';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
}

export function Login() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');
    const isMobile = useIsMobile();

    const styles = {
        rightContainer: {
            width: "100%",
            maxWidth: isMobile ? "100%" : "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        container: {
            width: "100%",
            maxWidth: isMobile ? "95vw" : "400px",
            padding: isMobile ? "20px 10px" : "40px",
            backgroundColor: "#403f3f",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
        },
        h1: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: isMobile ? "1.3rem" : "2rem",
            textAlign: "center",
            margin: 0,
        },
        errorMessage: {
            color: "#ff4444",
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            textAlign: "center",
            marginBottom: "10px"
        },
        googleButton: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: isMobile ? "10px 10px" : "12px 24px",
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "500",
            fontSize: isMobile ? "15px" : "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s, transform 0.1s"
        },
        googleIcon: {
            width: isMobile ? "18px" : "20px",
            height: isMobile ? "18px" : "20px"
        }
    };

    useEffect(() => {
        // Check for error in URL parameters
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }

        // If already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate, searchParams]);

    const handleGoogleLogin = async () => {
        try {
            // Redirigir al backend para autenticación con Google
            window.location.href = 'https://udprojectstest-production.up.railway.app/login';
        } catch (error) {
            setError("Error al iniciar sesión. Por favor, intenta nuevamente.");
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="login-page-responsive">
            <img src="/Proyectoudpnegrosf.png" alt="Logo UDP" className="login-logo-responsive" />
            <div style={styles.rightContainer}>
                <div style={styles.container}>
                    <h1 style={styles.h1}>Inicia sesión con tu cuenta UDP</h1>
                    {error && <div style={styles.errorMessage}>{error}</div>}
                    <button
                        style={styles.googleButton}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#f1f1f1"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#fff"}
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src={"/google-icon.png"}
                            alt="Google"
                            style={styles.googleIcon}
                        />
                        Iniciar sesión con Google
                    </button>
                </div>
            </div>
        </div>
    );
}
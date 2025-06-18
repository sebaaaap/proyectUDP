// Login.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// src/Paginas/Login.jsx
import { useAuth } from '../context/AuthContext';

export function Login() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');

    const styles = {
        page: {
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to bottom, #272627, #000000)",
        },
        image: {
            height: "220px",
            marginRight: "60px",
            padding: "10px"
        },
        rightContainer: {
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        container: {
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
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
            fontSize: "2rem",
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
            padding: "12px 24px",
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "500",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s, transform 0.1s"
        },
        googleIcon: {
            width: "20px",
            height: "20px"
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
            window.location.href = 'http://localhost:8000/login';
        } catch (error) {
            setError("Error al iniciar sesión. Por favor, intenta nuevamente.");
            console.error("Error during login:", error);
        }
    };

    return (
        <div style={styles.page}>
            <img src="/Proyectoudpnegrosf.png" alt="Logo UDP" style={styles.image} />
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
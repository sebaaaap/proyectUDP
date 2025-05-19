import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [tipo, setTipo] = useState("estudiante");
    const [error, setError] = useState(false);
    const [correoInvalido, setCorreoInvalido] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (correo === "" || contrasena === "") {
            setError(true);
            setCorreoInvalido(false);
            return;
        }

        if (!correo.endsWith("@mail.udp.cl")) {
            setCorreoInvalido(true);
            setError(false);
            return;
        }

        if (tipo === "estudiante") {
            navigate("/dashboard-estudiante");
        } else if (tipo === "profesor") {
            navigate("/dashboard-profe");
        }
    };

    const styles = {
        page: {
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            background: "#272627",
            position: "relative",
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
            alignItems: "flex-end",
        },
        container: {
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
            backgroundColor: "#403f3f",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
        formGroup: {
            marginBottom: "15px",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#fff",
        },
        input: {
            width: "100%",
            padding: "8px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            backgroundColor: "#555",
            color: "#fff",
        },
        submitButton: {
            width: "100%",
            padding: "10px",
            backgroundColor: "#4f0000",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            transition: "all 0.2s",
        },
        submitButtonHover: {
            transform: "scale(1.05)",
            backgroundColor: "#4f0000",
        },
        errorText: {
            color: "red",
            textAlign: "center",
        },
        h1: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: "2.5rem",
            margin: "0 0 25px 90px",
            alignSelf: "center",
        },
        toggleContainer: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "24px",
            marginBottom: "8px",
            justifyContent: "center"
        },
        toggleLabel: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
        },
        toggleSwitch: {
            width: "56px",
            height: "32px",
            borderRadius: "999px",
            background: tipo === "profesor" ? "#007bff" : "#888",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.2s",
            border: "2px solid #007bff",
            display: "flex",
            alignItems: "center",
        },
        toggleCircle: {
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            left: tipo === "profesor" ? "24px" : "2px",
            top: "2px",
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }
    };

    return (
        <div style={styles.page}>
            <img src="/Proyectoudpnegro.png" alt="Logo UDP" style={styles.image} />
            <div style={styles.rightContainer}>
                <h1 style={styles.h1}>Iniciar Sesión</h1>
                <div style={styles.container}>
                    <form onSubmit={handlesubmit}>
                        <div style={styles.formGroup}>
                            <label htmlFor="Correo" style={styles.label}>Correo electrónico:</label>
                            <input
                                type="email"
                                id="Correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                style={styles.input}
                                placeholder="Claudio.bravo@mail.udp.cl"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="Contrasena" style={styles.label}>Contraseña:</label>
                            <input
                                type="password"
                                id="Contrasena"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                style={styles.input}
                                placeholder="***********************"
                            />
                        </div>
                        {/* Toggle tipo usuario */}
                        <div style={styles.toggleContainer}>
                            <span style={styles.toggleLabel}>¿Eres profesor?</span>
                            <div
                                style={styles.toggleSwitch}
                                onClick={() => setTipo(tipo === "profesor" ? "estudiante" : "profesor")}
                                tabIndex={0}
                                role="button"
                                aria-pressed={tipo === "profesor"}
                            >
                                <div style={styles.toggleCircle}></div>
                            </div>
                        </div>
                        <input
                            type="submit"
                            value="Iniciar sesión"
                            style={
                                isHover
                                    ? { ...styles.submitButton, ...styles.submitButtonHover }
                                    : styles.submitButton
                            }
                            onMouseOver={() => setIsHover(true)}
                            onMouseOut={() => setIsHover(false)}
                        />
                    </form>
                    {error && <p style={styles.errorText}>Por favor, completa todos los campos.</p>}
                    {correoInvalido && <p style={styles.errorText}>El correo debe terminar en @mail.udp.cl</p>}
                </div>
            </div>
        </div>
    );
}
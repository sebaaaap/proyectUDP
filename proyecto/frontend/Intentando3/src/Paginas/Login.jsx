import { useState } from "react";

export function Login() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(false);
    const [correoInvalido, setCorreoInvalido] = useState(false);

    const handlesubmit = (e) => {
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
        setError(false);
        setCorreoInvalido(false);
        console.log("Datos enviados:", { correo, contrasena });
    };

    // Estilos en línea
    const styles = {
        container: {
            maxWidth: "400px",
            padding: "40px",
            backgroundColor: "#403f3f", // Fondo blanco del formulario
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginLeft: "1100px",
        },
        title: {
            textAlign: "right",
            color: "#fff",
            marginTop: "110px",
            marginRight: "100px",
            fontWeight: "bold",

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
            marginLeft: "65px",
            width: "60%",
            padding: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
        },
        submitButtonHover: {
            transform: "scale(1.1)",
            backgroundColor: "#0056b3",
        },
        errorText: {
            color: "red",
        },
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Iniciar Sesión</h1>
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
                    <input
                        type="submit"
                        value="Registrar"
                        style={styles.submitButton}
                        onMouseOver={(e) => {
                            e.target.style.transform = styles.submitButtonHover.transform;
                            e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.backgroundColor = styles.submitButton.backgroundColor;
                        }}
                    />
                </form>
                {error && alert("Por favor, completa todos los campos.")}
                {correoInvalido && <p style={styles.errorText}>El correo debe terminar en @mail.udp.cl</p>}
            </div>
        </div>
    );
}
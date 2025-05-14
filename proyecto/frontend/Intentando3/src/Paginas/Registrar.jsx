import { useState } from "react";

export function Registrar() {
    const [nombre, setNombre] = useState("");
    const [rut, setRut] = useState("");
    const [carrera, setCarrera] = useState("");
    const [correo, setCorreo] = useState("");
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nombre || !rut || !carrera || !correo) {
            setError(true);
            alert("Por favor, complete todos los campos.");
        }

        if (!correo.endsWith("@mail.udp.cl")) {
            setError(true);
            setMensajeError("El correo debe terminar en @mail.udp.cl.");
            return;
        }

        setError(false);
        setMensajeError("");
        console.log("Datos registrados:", { nombre, rut, carrera, correo });
    };

    const styles = {
        container: {
            maxWidth: "400px",
            padding: "40px",
            backgroundColor: "#403f3f",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginLeft: "1100px",
        },
        title: {
            textAlign: "right",
            color: "#fff",
            marginTop: "70px",
            marginRight: "145px",
            fontWeight: "bold",
        },
        formGroup: {
            marginBottom: "10px",
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
        select: {
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
        <div style={styles.body}>
            <h1 style={styles.title}>Registro</h1>
            <div style={styles.container}>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="nombre" style={styles.label}>Nombre completo:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={styles.input}
                            placeholder="Claudio Bravo"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="rut" style={styles.label}>RUT:</label>
                        <input
                            type="text"
                            id="rut"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            style={styles.input}
                            placeholder="XX.XXX.XXX-X"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="carrera" style={styles.label}>Carrera:</label>
                        <select
                            id="carrera"
                            value={carrera}
                            onChange={(e) => setCarrera(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">Seleccione su carrera</option>
                            <option value="Ingeniería en Informática">Ingeniería en Informática</option>
                            <option value="Ingeniería Civil">Ingeniería Civil</option>
                            <option value="Medicina">Medicina</option>
                            <option value="Derecho">Derecho</option>
                            <option value="Psicología">Psicología</option>
                            <option value="Arquitectura">Arquitectura</option>
                            <option value="Diseño Gráfico">Diseño Gráfico</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="correo" style={styles.label}>Correo electrónico (@mail.udp.cl):</label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            style={styles.input}
                            placeholder="Claudio.bravo@mail.udp.cl"
                        />
                    </div>
                    {error && <p style={styles.errorText}>{mensajeError}</p>}
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
            </div>
        </div>
    );
}
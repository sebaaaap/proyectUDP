//registrar.jsx
import { useState } from "react";

export function Registrar() {
    const [tipo, setTipo] = useState("estudiante"); // "estudiante" o "profesor"
    const [nombre1, setNombre1] = useState("");
    const [nombre2, setNombre2] = useState("");
    const [apellido1, setApellido1] = useState("");
    const [apellido2, setApellido2] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [nacionalidad, setNacionalidad] = useState("");
    const [genero, setGenero] = useState("");
    const [anioIngreso, setAnioIngreso] = useState("");
    const [telefono, setTelefono] = useState("");
    const [carrera, setCarrera] = useState("");
    const [facultad, setFacultad] = useState("");
    const [correo, setCorreo] = useState("");
    const [rut, setRut] = useState("");
    // Campos solo para profesor
    const [especialidad, setEspecialidad] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [isHover, setIsHover] = useState(false);

    // Validación de rut: 7 u 8 dígitos, último puede ser número o k/K
    const validarRut = (valor) => {
        const rutRegex = /^\d{7,8}[0-9kK]$/;
        return rutRegex.test(valor);
    };

    // Validación de teléfono: solo números
    const validarTelefono = (valor) => {
        const telRegex = /^\d+$/;
        return telRegex.test(valor);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones comunes
        if (
            !nombre1 || !apellido1 || !apellido2 || !telefono ||
            !facultad || !rut
        ) {
            setError(true);
            setMensajeError("Por favor, complete todos los campos obligatorios.");
            return;
        }

        if (!validarRut(rut)) {
            setError(true);
            setMensajeError("El RUT debe tener 8 o 9 caracteres, solo números y el último puede ser número o 'k'.");
            return;
        }

        if (!validarTelefono(telefono)) {
            setError(true);
            setMensajeError("El teléfono solo debe contener números.");
            return;
        }

        // Validaciones específicas
        if (tipo === "estudiante") {
            if (
                !fechaNacimiento || !nacionalidad || !genero ||
                !anioIngreso || !carrera || !correo
            ) {
                setError(true);
                setMensajeError("Por favor, complete todos los campos obligatorios de estudiante.");
                return;
            }
            if (!correo.endsWith("@mail.udp.cl")) {
                setError(true);
                setMensajeError("El correo debe terminar en @mail.udp.cl.");
                return;
            }
            if (anioIngreso < 2000 || anioIngreso > 2025) {
                setError(true);
                setMensajeError("El año de ingreso debe estar entre 2000 y 2025.");
                return;
            }
        } else if (tipo === "profesor") {
            if (!especialidad || !departamento) {
                setError(true);
                setMensajeError("Por favor, complete todos los campos obligatorios de profesor.");
                return;
            }
        }

        setError(false);
        setMensajeError("");
        // Aquí puedes enviar los datos al backend según el tipo
        if (tipo === "estudiante") {
            console.log("Datos estudiante:", {
                nombre1, nombre2, apellido1, apellido2, fechaNacimiento,
                nacionalidad, genero, anioIngreso, telefono, carrera, facultad, correo, rut
            });
        } else {
            console.log("Datos profesor:", {
                nombre1, nombre2, apellido1, apellido2, telefono, facultad, rut, especialidad, departamento
            });
        }
    };

    const styles = {
        page: {
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#222",
            position: "relative",
            overflow: "hidden",
        },
        centerContainer: {
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
        },
        h1: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: "2.5rem",
            margin: "0 0 24px 0",
            alignSelf: "center",
        },
        container: {
            width: "100%",
            maxWidth: "500px",
            padding: "40px",
            backgroundColor: "#403f3f",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
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
            backgroundColor: "#0056b3",
        },
        errorText: {
            color: "red",
            textAlign: "center",
        }
        // Se elimina decorativeImage
    };

    // Solo permitir números y k/K en el input de rut
    const handleRutChange = (e) => {
        const valor = e.target.value.replace(/[^0-9kK]/g, "");
        setRut(valor);
    };

    // Solo permitir números en el input de teléfono
    const handleTelefonoChange = (e) => {
        const valor = e.target.value.replace(/\D/g, "");
        setTelefono(valor);
    };

    return (
        <div style={styles.page}>
            <div style={styles.centerContainer}>
                <h1 style={styles.h1}>Registro</h1>
                <div style={styles.container}>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Tipo de usuario:</label>
                            <select
                                value={tipo}
                                onChange={e => setTipo(e.target.value)}
                                style={styles.select}
                            >
                                <option value="estudiante">Estudiante</option>
                                <option value="profesor">Profesor</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="nombre1" style={styles.label}>Primer Nombre:</label>
                            <input
                                type="text"
                                id="nombre1"
                                value={nombre1}
                                onChange={(e) => setNombre1(e.target.value)}
                                style={styles.input}
                                placeholder="Ej: Claudio"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="nombre2" style={styles.label}>Segundo Nombre:</label>
                            <input
                                type="text"
                                id="nombre2"
                                value={nombre2}
                                onChange={(e) => setNombre2(e.target.value)}
                                style={styles.input}
                                placeholder="Ej: Andrés"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="apellido1" style={styles.label}>Primer Apellido:</label>
                            <input
                                type="text"
                                id="apellido1"
                                value={apellido1}
                                onChange={(e) => setApellido1(e.target.value)}
                                style={styles.input}
                                placeholder="Ej: Bravo"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="apellido2" style={styles.label}>Segundo Apellido:</label>
                            <input
                                type="text"
                                id="apellido2"
                                value={apellido2}
                                onChange={(e) => setApellido2(e.target.value)}
                                style={styles.input}
                                placeholder="Ej: Soto"
                            />
                        </div>
                        {/* Campos solo para estudiante */}
                        {tipo === "estudiante" && (
                            <>
                                <div style={styles.formGroup}>
                                    <label htmlFor="fechaNacimiento" style={styles.label}>Fecha de Nacimiento:</label>
                                    <input
                                        type="date"
                                        id="fechaNacimiento"
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="nacionalidad" style={styles.label}>Nacionalidad:</label>
                                    <input
                                        type="text"
                                        id="nacionalidad"
                                        value={nacionalidad}
                                        onChange={(e) => setNacionalidad(e.target.value)}
                                        style={styles.input}
                                        placeholder="Ej: Chilena"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="genero" style={styles.label}>Género:</label>
                                    <select
                                        id="genero"
                                        value={genero}
                                        onChange={(e) => setGenero(e.target.value)}
                                        style={styles.select}
                                    >
                                        <option value="">Seleccione su género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="anioIngreso" style={styles.label}>Año de Ingreso Académico:</label>
                                    <input
                                        type="number"
                                        id="anioIngreso"
                                        value={anioIngreso}
                                        onChange={(e) => setAnioIngreso(e.target.value)}
                                        style={styles.input}
                                        placeholder="Ej: 2022"
                                        min="2000"
                                        max="2025"
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
                            </>
                        )}
                        {/* Campos solo para profesor */}
                        {tipo === "profesor" && (
                            <>
                                <div style={styles.formGroup}>
                                    <label htmlFor="especialidad" style={styles.label}>Especialidad:</label>
                                    <input
                                        type="text"
                                        id="especialidad"
                                        value={especialidad}
                                        onChange={(e) => setEspecialidad(e.target.value)}
                                        style={styles.input}
                                        placeholder="Ej: Matemáticas"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="departamento" style={styles.label}>Departamento:</label>
                                    <input
                                        type="text"
                                        id="departamento"
                                        value={departamento}
                                        onChange={(e) => setDepartamento(e.target.value)}
                                        style={styles.input}
                                        placeholder="Ej: Ciencias Exactas"
                                    />
                                </div>
                            </>
                        )}
                        {/* Campos comunes */}
                        <div style={styles.formGroup}>
                            <label htmlFor="telefono" style={styles.label}>Teléfono:</label>
                            <input
                                type="tel"
                                id="telefono"
                                value={telefono}
                                onChange={handleTelefonoChange}
                                style={styles.input}
                                placeholder="Ej: 912345678"
                                maxLength={12}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="rut" style={styles.label}>RUT:</label>
                            <input
                                type="text"
                                id="rut"
                                value={rut}
                                onChange={handleRutChange}
                                style={styles.input}
                                placeholder="Ej: 12345678k"
                                minLength={8}
                                maxLength={9}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="facultad" style={styles.label}>Facultad:</label>
                            <input
                                type="text"
                                id="facultad"
                                value={facultad}
                                onChange={(e) => setFacultad(e.target.value)}
                                style={styles.input}
                                placeholder="Ej: Facultad de Ingeniería"
                            />
                        </div>
                        {error && <p style={styles.errorText}>{mensajeError}</p>}
                        <input
                            type="submit"
                            value="Registrar"
                            style={
                                isHover
                                    ? { ...styles.submitButton, ...styles.submitButtonHover }
                                    : styles.submitButton
                            }
                            onMouseOver={() => setIsHover(true)}
                            onMouseOut={() => setIsHover(false)}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
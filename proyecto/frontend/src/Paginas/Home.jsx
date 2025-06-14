// Home.jsx
export const Home = () => {
    return (
        <div style={{ width: "100%", margin: 0, padding: 0 }}>
            {/* Imagen de portada que ocupa toda la pantalla */}
            <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
                <img
                    src="/imagenhome.jpg" // cambia esto por tu imagen real
                    alt="Portada"
                    style={{
                        width: "100%",
                        height: "90%",
                        objectFit: "cover"
                    }}
                />
            </div>

            {/* Contenido informativo debajo de la imagen */}
            <div
                style={{
                    background: "linear-gradient(to bottom, #272627, #000000)",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "40px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    fontSize: "1.15rem",
                    lineHeight: "1.7",
                    textAlign: "center",
                    marginTop: "40px"
                }}
            >
                <h2 style={{ marginBottom: "18px", color: "#fff" }}>
                    Bienvenido a la Plataforma de Proyectos UDP
                </h2>
                <p>
                    Es una plataforma exclusiva para estudiantes y profesores de la UDP.
                </p>
                <p>
                    Permite a estudiantes con ideas de proyectos interdisciplinarios postularlas para que un profesor las valide y defina el equipo necesario. Una vez aprobado, el proyecto queda visible para que otros estudiantes postulen o sean invitados según su perfil.
                </p>
                <p>
                    Durante el semestre, los equipos podrán subir distintos tipos de archivos en la plataforma (PDF, .docs, xls, etc.), para complementar el proyecto o recibir una evaluación con calificación y feedback. Anual o semestralmente, se genera un ranking con los mejores proyectos.
                </p>
            </div>
        </div>
    );
};

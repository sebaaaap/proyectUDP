// Home.jsx
export const Home = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "28px"        }}
        > 
            <img
                src="/Estudiante.png"
                alt="Estudiante"
                style={{
                    width: "250px",
                
                    marginBottom: "32px"
                }}
            />
            <div
                style={{
                    background: "linear-gradient(to bottom, #272627, #000000)",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "40px",
                    maxWidth: "800px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    fontSize: "1.15rem",
                    lineHeight: "1.7",
                    textAlign: "center"
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
                    Durante el semestre, los equipos podran subir distintos tipos de archivos en la plataforma (PDF, .docs, xls, etc), para complementar el proyecto o recibir una evaluación con calificación y feedback. Anual o semestralmente, se genera un ranking con los mejores proyectos.
                </p>
            </div>
        </div>
    );
};
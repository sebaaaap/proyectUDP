// Paginas/Ranking.jsx
import { useEffect, useState } from "react";

export function Ranking() {
    const [proyectos, setProyectos] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [misVotos, setMisVotos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    
    // En una app real, esto vendría del contexto de autenticación
    const profesorActual = { id: 1, nombre: "Juan Carlos Gómez" };

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            
            // Cargar ranking
            const responseRanking = await fetch("http://localhost:8000/ranking");
            const dataRanking = await responseRanking.json();
            setProyectos(dataRanking.proyectos);
            
            // Cargar estadísticas
            const responseStats = await fetch("http://localhost:8000/estadisticas-votos");
            const dataStats = await responseStats.json();
            setEstadisticas(dataStats);
            
            // Cargar mis votos
            const responseMisVotos = await fetch(`http://localhost:8000/mis-votos/${profesorActual.id}`);
            const dataMisVotos = await responseMisVotos.json();
            setMisVotos(dataMisVotos.map(voto => voto.id_proyecto));
            
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError("Error al cargar el ranking");
        } finally {
            setCargando(false);
        }
    };

    const handleVotar = async (idProyecto) => {
        try {
            const response = await fetch("http://localhost:8000/votar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_proyecto: idProyecto,
                    id_profesor: profesorActual.id
                })
            });

            if (response.ok) {
                await cargarDatos(); // Recargar datos
                setError("");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Error al votar");
            }
        } catch (error) {
            console.error("Error al votar:", error);
            setError("Error al procesar el voto");
        }
    };

    const handleQuitarVoto = async (idProyecto) => {
        try {
            const response = await fetch(`http://localhost:8000/votar/${idProyecto}/${profesorActual.id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                await cargarDatos(); // Recargar datos
                setError("");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Error al quitar voto");
            }
        } catch (error) {
            console.error("Error al quitar voto:", error);
            setError("Error al procesar la acción");
        }
    };

    const yaVote = (idProyecto) => {
        return misVotos.includes(idProyecto);
    };

    const getRankingIcon = (posicion) => {
        switch(posicion) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return `#${posicion}`;
        }
    };

    const styles = {
        container: {
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #272627, #000000)",
            padding: "20px",
            color: "#fff"
        },
        header: {
            textAlign: "center",
            marginBottom: "30px"
        },
        title: {
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
        },
        statsContainer: {
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap"
        },
        statCard: {
            backgroundColor: "#403f3f",
            padding: "15px 25px",
            borderRadius: "15px",
            textAlign: "center",
            minWidth: "150px"
        },
        statNumber: {
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#4ecdc4"
        },
        statLabel: {
            fontSize: "0.9rem",
            color: "#ccc",
            marginTop: "5px"
        },
        proyectoCard: {
            backgroundColor: "#403f3f",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "15px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            transition: "transform 0.2s",
            cursor: "pointer"
        },
        proyectoCardHover: {
            transform: "translateY(-2px)"
        },
        rankingHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px"
        },
        rankingIcon: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            minWidth: "60px"
        },
        voteSection: {
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },
        voteCount: {
            backgroundColor: "#4ecdc4",
            color: "#000",
            padding: "5px 15px",
            borderRadius: "20px",
            fontWeight: "bold",
            fontSize: "0.9rem"
        },
        voteButton: {
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s"
        },
        voteButtonActive: {
            backgroundColor: "#ff6b6b",
            color: "#fff"
        },
        voteButtonInactive: {
            backgroundColor: "#555",
            color: "#fff"
        },
        proyectoTitle: {
            fontSize: "1.3rem",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#fff"
        },
        proyectoInfo: {
            color: "#ccc",
            fontSize: "0.9rem",
            marginBottom: "10px"
        },
        proyectoDescription: {
            color: "#ddd",
            lineHeight: "1.5"
        },
        errorMessage: {
            backgroundColor: "#ff6b6b",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
        },
        loading: {
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#4ecdc4"
        }
    };

    if (cargando) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Cargando ranking...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🏆 Ranking de Proyectos UDP</h1>
                <p style={{ color: "#ccc" }}>Vota por los mejores proyectos de la universidad</p>
            </div>

            {/* Estadísticas */}
            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{estadisticas.total_votos || 0}</div>
                    <div style={styles.statLabel}>Total Votos</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{estadisticas.total_proyectos_con_votos || 0}</div>
                    <div style={styles.statLabel}>Proyectos Votados</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{estadisticas.total_profesores_votantes || 0}</div>
                    <div style={styles.statLabel}>Profesores Participando</div>
                </div>
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {/* Lista de proyectos */}
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {proyectos.map((proyecto, index) => (
                    <div
                        key={proyecto.id}
                        style={styles.proyectoCard}
                        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style={styles.rankingHeader}>
                            <div style={styles.rankingIcon}>
                                {getRankingIcon(index + 1)}
                            </div>
                            <div style={styles.voteSection}>
                                <div style={styles.voteCount}>
                                    {proyecto.votos_count} votos
                                </div>
                                <button
                                    style={{
                                        ...styles.voteButton,
                                        ...(yaVote(proyecto.id) ? styles.voteButtonActive : styles.voteButtonInactive)
                                    }}
                                    onClick={() => yaVote(proyecto.id) ? 
                                        handleQuitarVoto(proyecto.id) : 
                                        handleVotar(proyecto.id)
                                    }
                                >
                                    {yaVote(proyecto.id) ? "❤️ Votado" : "🤍 Votar"}
                                </button>
                            </div>
                        </div>
                        
                        <div style={styles.proyectoTitle}>
                            {proyecto.titulo}
                        </div>
                        
                        <div style={styles.proyectoInfo}>
                            👨‍🏫 {proyecto.profesor_creador} | 📚 {proyecto.area_conocimiento}
                        </div>
                        
                        <div style={styles.proyectoDescription}>
                            {proyecto.descripcion}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
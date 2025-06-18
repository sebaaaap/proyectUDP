from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Enum as SqlEnum
from sqlalchemy.orm import relationship
import enum
from database.db import  Base

class EstadoProyectoDBEnum(enum.Enum):
    propuesto = "propuesto"
    en_revision = "en_revision"
    aprobado = "aprobado"
    rechazado = "rechazado"

class Proyecto(Base):
    __tablename__ = "proyectos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(Text)
    resumen = Column(Text)
    problema = Column(Text)
    justificacion = Column(Text)
    impacto = Column(Text)

    creador_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    profesor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    perfiles_requeridos = Column(JSON, default=[])
    estado = Column(SqlEnum(EstadoProyectoDBEnum), default=EstadoProyectoDBEnum.propuesto)

    creador = relationship(
        "Usuario",
        foreign_keys=[creador_id],
        back_populates="proyectos_creados"
    )

    profesor = relationship(
        "Usuario",
        foreign_keys=[profesor_id],
        back_populates="proyectos_asignados"
    )

    archivos = relationship("ArchivoProyecto", back_populates="proyecto")
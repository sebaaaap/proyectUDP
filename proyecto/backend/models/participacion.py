from sqlalchemy import Column, Integer, ForeignKey, String, Date, Enum as SqlEnum, UniqueConstraint
from sqlalchemy.orm import *
from database.db import Base


from sqlalchemy.orm import relationship
from database.db import Base
import enum

class RolParticipanteEnum(enum.Enum):
    colaborador = "colaborador"
    co_lider = "co_lider"
    lider = "lider"

class EstadoParticipacionEnum(enum.Enum):
    pendiente = "pendiente"
    aprobado = "aprobado"
    rechazado = "rechazado"

class Participacion(Base):
    __tablename__ = "participaciones"
    __table_args__ = (
        UniqueConstraint('id_proyecto', 'id_estudiante', name='uq_participacion_proyecto_estudiante'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"))
    id_estudiante = Column(Integer, ForeignKey("estudiantes.id")) 
    rol = Column(SqlEnum(RolParticipanteEnum))
    fecha_inicio = Column(Date)
    fecha_termino = Column(Date)
    estado_aprobacion = Column(SqlEnum(EstadoParticipacionEnum))

    # Relaciones
    alumno = relationship("Estudiante", back_populates="participaciones")
    proyecto_rel = relationship("Proyecto", back_populates="participantes")
    archivos = relationship(
        "ArchivoProyecto",
        foreign_keys="[ArchivoProyecto.id_proyecto, ArchivoProyecto.id_estudiante]",
        back_populates="participacion",
        cascade="all, delete-orphan"
    )
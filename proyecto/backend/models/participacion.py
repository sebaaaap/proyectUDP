from sqlalchemy import Column, Integer, ForeignKey, String, Date, Enum as SqlEnum
from sqlalchemy.orm import *
from database.db import Base
from sqlalchemy.orm import relationship
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

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"))
    id_estudiante = Column(Integer, ForeignKey("estudiantes.id")) 
    rol = Column(SqlEnum(RolParticipanteEnum))
    fecha_inicio = Column(Date)
    fecha_termino = Column(Date)
    estado_aprobacion = Column(SqlEnum(EstadoParticipacionEnum))

    alumno = relationship("Estudiante", back_populates="participaciones")
    archivos = relationship("ArchivoProyecto", back_populates="participacion", cascade="all, delete-orphan")

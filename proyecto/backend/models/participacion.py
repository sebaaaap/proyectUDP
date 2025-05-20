from sqlalchemy import Column, Integer, ForeignKey, String, Date, Enum as SqlEnum
from sqlalchemy.orm import *
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

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"))
    id_estudiante = Column(Integer, ForeignKey("estudiantes.id"))  # Asegúrate que sea Integer
    
    rol = Column(SqlEnum(RolParticipanteEnum))
    fecha_inicio = Column(Date)
    fecha_termino = Column(Date)
    estado_aprobacion = Column(SqlEnum(EstadoParticipacionEnum))
    
    # Relaciones
    proyectos = relationship("Proyecto", back_populates="participaciones")
    
    
    
    
from sqlalchemy import Column, Integer, ForeignKey, String, Date, Enum as SqlEnum
from database.db import Base
import enum

class RolParticipanteEnum(enum.Enum):
    colaborador = "colaborador"
    co_lider = "co_lider"

class EstadoParticipacionEnum(enum.Enum):
    pendiente = "pendiente"
    aprobado = "aprobado"
    rechazado = "rechazado"

class Participacion(Base):
    __tablename__ = "participaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"))
    id_estudiante = Column(String)  # RUT del estudiante
    rol = Column(SqlEnum(RolParticipanteEnum))
    fecha_inicio = Column(Date)
    fecha_termino = Column(Date)
    estado_aprobacion = Column(SqlEnum(EstadoParticipacionEnum))

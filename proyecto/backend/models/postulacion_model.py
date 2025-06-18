from sqlalchemy import Column, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base
import enum

class EstadoPostulacionEnum(enum.Enum):
    pendiente = "pendiente"
    aceptado = "aceptado"
    rechazado = "rechazado"

class Postulacion(Base):
    __tablename__ = "postulaciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"), nullable=False)
    estado = Column(Enum(EstadoPostulacionEnum), default=EstadoPostulacionEnum.pendiente)
    fecha_postulacion = Column(DateTime, default=datetime.utcnow)

    estudiante = relationship("Usuario")
    proyecto = relationship("Proyecto")
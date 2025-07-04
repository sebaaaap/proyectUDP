from sqlalchemy import Column, Integer, ForeignKey, Enum, DateTime, UniqueConstraint, Text
from sqlalchemy.orm import relationship, foreign
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
    motivacion = Column(Text, nullable=True)

    # Add unique constraint for proyecto_id and usuario_id
    __table_args__ = (
        UniqueConstraint('proyecto_id', 'usuario_id', name='uq_postulacion_proyecto_usuario'),
    )

    estudiante = relationship("Usuario")
    proyecto = relationship("Proyecto")
    archivos = relationship(
        "ArchivoProyecto",
        primaryjoin="and_(Postulacion.proyecto_id==foreign(ArchivoProyecto.id_proyecto), Postulacion.usuario_id==foreign(ArchivoProyecto.id_estudiante))",
        viewonly=True
    )
from sqlalchemy import Column, ForeignKeyConstraint, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class ArchivoProyecto(Base):
    __tablename__ = "archivos_proyecto"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), nullable=False)  # Corregido a "proyectos.id"
    nombre_archivo = Column(String, nullable=False)
    tipo_archivo = Column(String, nullable=True)
    url = Column(String, nullable=False)
    fecha_subida = Column(DateTime, default=datetime.utcnow)
    descripcion = Column(String)
    id_estudiante = Column(Integer, nullable=False)  # Eliminada la FK incorrecta

    # Relación compuesta correcta
    __table_args__ = (
        ForeignKeyConstraint(
            ['id_proyecto', 'id_estudiante'],
            ['participaciones.id_proyecto', 'participaciones.id_estudiante']
        ),
    )

    participacion = relationship(
        "Participacion",
        foreign_keys=[id_proyecto, id_estudiante],
        back_populates="archivos"
    )

    proyecto = relationship("Proyecto", back_populates="archivos")
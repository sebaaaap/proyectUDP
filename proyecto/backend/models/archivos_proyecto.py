from sqlalchemy import Column, ForeignKeyConstraint, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class ArchivoProyecto(Base):
    __tablename__ = "archivos_proyecto"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), nullable=False)
    nombre_archivo = Column(String, nullable=False, unique=True)
    tipo_archivo = Column(String, nullable=True)
    url = Column(String, nullable=False)
    fecha_subida = Column(DateTime, default=datetime.utcnow)
    descripcion = Column(String)
    id_estudiante = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    # Relación con Proyecto
    proyecto = relationship("Proyecto", back_populates="archivos")

    # Relación con Postulacion usando ForeignKeyConstraint
    __table_args__ = (
        ForeignKeyConstraint(
            ['id_proyecto', 'id_estudiante'],
            ['postulaciones.proyecto_id', 'postulaciones.usuario_id']
        ),
    )

    postulacion = relationship(
        "Postulacion",
        foreign_keys=[id_proyecto, id_estudiante],
        primaryjoin="and_(ArchivoProyecto.id_proyecto==Postulacion.proyecto_id, "
                   "ArchivoProyecto.id_estudiante==Postulacion.usuario_id)",
        back_populates="archivos",
        viewonly=True
    )
# models/archivo_proyecto.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class ArchivoProyecto(Base):
    __tablename__ = "archivos_proyecto"

    id = Column(Integer, primary_key=True, index=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), nullable=False)  # Corregido a "proyectos.id"
    nombre_archivo = Column(String, nullable=False)
    tipo_archivo = Column(String, nullable=True)
    url = Column(String, nullable=False)
    fecha_subida = Column(DateTime, default=datetime.utcnow)
    descripcion = Column(String)
    

    proyecto = relationship("Proyecto", back_populates="archivos")
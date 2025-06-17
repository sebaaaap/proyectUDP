# models/voto.py
from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime

class Voto(Base):
    __tablename__ = "votos"
    
    id = Column(Integer, primary_key=True, index=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), nullable=False)
    id_profesor = Column(Integer, ForeignKey("profesores.id"), nullable=False)
    fecha_voto = Column(DateTime, default=datetime.utcnow)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    proyecto = relationship("Proyecto", back_populates="votos")
    profesor = relationship("Profesor", back_populates="votos")
    
    # Constraint para evitar votos duplicados
    __table_args__ = (
        UniqueConstraint('id_proyecto', 'id_profesor', name='_proyecto_profesor_voto_uc'),
    )

# Agregar a proyecto.py la relación
# votos = relationship("Voto", back_populates="proyecto")

# Agregar a profesor.py la relación  
# votos = relationship("Voto", back_populates="profesor")
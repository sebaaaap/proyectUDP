# models/ranking_model.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class ProyectoRanking(Base):
    __tablename__ = "proyectos_ranking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"), nullable=False, unique=True)
    calificacion_final = Column(Float, nullable=False)  # Debe ser >= 6.0 para participar
    fecha_ingreso = Column(DateTime, default=datetime.utcnow)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    proyecto = relationship("Proyecto", back_populates="ranking_info")
    votos = relationship("VotoRanking", back_populates="proyecto_ranking", cascade="all, delete-orphan")
    
    @property
    def total_votos_positivos(self):
        """Cuenta solo los votos positivos (upvotes)"""
        return len([v for v in self.votos if v.voto_positivo and v.activo])
    
    @property
    def total_votos_negativos(self):
        """Cuenta solo los votos negativos (downvotes)"""
        return len([v for v in self.votos if not v.voto_positivo and v.activo])
    
    @property
    def puntuacion_neta(self):
        """Calcula la puntuación neta (upvotes - downvotes) como Reddit"""
        upvotes = self.total_votos_positivos
        downvotes = self.total_votos_negativos
        return upvotes - downvotes
    
    @property
    def total_votos(self):
        """Total de votos (positivos + negativos)"""
        return len([v for v in self.votos if v.activo])

class VotoRanking(Base):
    __tablename__ = "votos_ranking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    proyecto_ranking_id = Column(Integer, ForeignKey("proyectos_ranking.id"), nullable=False)
    profesor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    voto_positivo = Column(Boolean, nullable=False)  # True = upvote (↑), False = downvote (↓)
    fecha_voto = Column(DateTime, default=datetime.utcnow)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    proyecto_ranking = relationship("ProyectoRanking", back_populates="votos")
    profesor = relationship("Usuario", back_populates="votos_ranking")
    
    # Constraint para que cada profesor vote solo una vez por proyecto
    __table_args__ = (
        UniqueConstraint('proyecto_ranking_id', 'profesor_id', name='unique_voto_profesor_proyecto'),
    )
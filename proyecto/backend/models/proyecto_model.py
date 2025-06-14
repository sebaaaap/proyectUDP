# from sqlalchemy import Column, Integer, String, Date, Text, JSON, Float, ForeignKey
# from sqlalchemy import Enum as SqlEnum
# from sqlalchemy.orm import relationship
# import enum
# from ..database.db import Base

# class EstadoProyectoDBEnum(enum.Enum):
#     propuesto = "propuesto"
#     en_desarrollo = "en_desarrollo"
#     finalizado = "finalizado"


# class Proyecto(Base):
#     __tablename__ = "proyectos"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     titulo = Column(String, nullable=False)
#     descripcion = Column(Text)
#     problema = Column(Text)
#     objetivo_general = Column(Text)
#     area_conocimiento = Column(String)
#     fecha_inicio = Column(Date)
#     fecha_fin = Column(Date)
#     estado = Column(SqlEnum(EstadoProyectoDBEnum, name="estado_proyecto_enum"), default=EstadoProyectoDBEnum.propuesto)
#     presupuesto_asignado = Column(Float, nullable=True)
#     informacion_adicional = Column(JSON, nullable=True, default={})
#     objetivo_especificos = Column(JSON, nullable=True, default={})

#     usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)  # Asociar creador
#     creador = relationship("Usuario", back_populates="proyectos")
#     postulaciones = relationship("Postulacion", back_populates="proyecto")




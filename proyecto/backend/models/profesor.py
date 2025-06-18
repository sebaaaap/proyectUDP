# from sqlalchemy import Column, Integer, String
# from sqlalchemy.orm import *
# from database.db import Base

# class Profesor(Base):
#     __tablename__ = "profesores"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     rut_profesor = Column(String, unique=True, nullable=False)
#     facultad = Column(String)
#     especialidad = Column(String)
#     departamento = Column(String)
#     email = Column(String, unique=True, nullable=False)
        

#     proyecto = relationship("Proyecto", back_populates="profesor")
#     # evaluacion = relationship("Evaluacion", back_populates="profesor")
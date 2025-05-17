from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum as PyEnum

class EstadoProyectoSchemaEnum(str, PyEnum):
    propuesto = "propuesto"
    aprobado = "aprobado"
    en_curso = "en_curso"
    finalizado = "finalizado"

class ProyectoBase(BaseModel):
    titulo: str
    descripcion: Optional[str]
    area_conocimiento: Optional[str]
    facultad_relacionada: Optional[str]
    fecha_inicio: Optional[date]
    fecha_fin: Optional[date]
    estado: EstadoProyectoSchemaEnum
    presupuesto_asignado: Optional[float]
    id_prof: int
    id_estudiante_creador: Optional[str]
    id_sc: Optional[str]

class ProyectoCreate(ProyectoBase):
    pass

class ProyectoOut(ProyectoBase):
    id: int

    class Config:
        orm_mode = True

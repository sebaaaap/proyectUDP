from pydantic import BaseModel
from typing import List
from enum import Enum

class EstadoProyectoDBEnum(str, Enum):
    propuesto = "propuesto"
    en_revision = "en_revision"
    aprobado = "aprobado"
    rechazado = "rechazado"

class PerfilRequerido(BaseModel):
    carrera: str
    cantidad: int


class ProyectoCreate(BaseModel):
    titulo: str
    descripcion: str
    resumen: str
    problema: str
    justificacion: str
    impacto: str
    profesor_id: int
    perfiles_requeridos: List[PerfilRequerido]

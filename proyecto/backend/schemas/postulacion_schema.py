from pydantic import BaseModel
from enum import Enum

class EstadoPostulacionEnum(str, Enum):
    pendiente = "pendiente"
    aceptado = "aceptado"
    rechazado = "rechazado"

class PostulacionBase(BaseModel):
    proyecto_id: int
    estado: EstadoPostulacionEnum

class PostulacionCreate(BaseModel):
    proyecto_id: int
    motivacion: str

class PostulacionResponse(BaseModel):
    id: int
    proyecto_id: int
    estudiante_id: int
    estado: EstadoPostulacionEnum

    class Config:
        orm_mode = True
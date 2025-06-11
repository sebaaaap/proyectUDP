from pydantic import BaseModel
from enum import Enum

class EstadoPostulacionEnum(str, Enum):
    pendiente = "pendiente"
    aceptado = "aceptado"
    rechazado = "rechazado"

class PostulacionCreate(BaseModel):
    proyecto_id: int

class PostulacionRespuesta(BaseModel):
    id: int
    usuario_id: int
    proyecto_id: int
    estado: EstadoPostulacionEnum

    class Config:
        orm_mode = True

class PostulacionUpdate(BaseModel):
    estado: EstadoPostulacionEnum

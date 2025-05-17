# schemas
# schemas
from pydantic import BaseModel
from datetime import date
from enum import Enum
from typing import Optional

class EstadoCFGEnum(str, Enum):
    pendiente = "pendiente"
    aprobado = "aprobado"
    rechazado = "rechazado"

class CFGEquivalenciaBase(BaseModel):
    id_proyecto: int
    id_sc: Optional[str]
    creditos_equivalentes: int
    estado_aprobacion: EstadoCFGEnum
    fecha_aprobacion: Optional[date]

class CFGEquivalenciaCreate(CFGEquivalenciaBase):
    pass

class CFGEquivalenciaOut(CFGEquivalenciaBase):
    id: int

    class Config:
        orm_mode = True
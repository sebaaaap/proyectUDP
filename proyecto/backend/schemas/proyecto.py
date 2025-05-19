from pydantic import BaseModel
from typing import Optional, List, Dict

class ProyectoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    estado: Optional[str] = "propuesto"

class ProyectoCreate(ProyectoBase):
    objetivo_general: str
    informacion_adicional: Optional[Dict] = {}
    objetivos_especificos: Optional[List[str]] = []

class ProyectoResponse(ProyectoBase):
    id: int
    class Config:
        from_attributes = True
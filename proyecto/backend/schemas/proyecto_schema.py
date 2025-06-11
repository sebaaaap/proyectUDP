from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import date
from enum import Enum

class EstadoProyectoDBEnum(str, Enum):
    propuesto = "propuesto"
    aprobado = "aprobado"
    rechazado = "rechazado"

class ProyectoCreate(BaseModel):
    titulo: str
    descripcion: Optional[str]
    problema: Optional[str]
    objetivo_general: Optional[str]
    area_conocimiento: Optional[str]
    fecha_inicio: Optional[date]
    fecha_fin: Optional[date]
    estado: Optional[EstadoProyectoDBEnum] = EstadoProyectoDBEnum.propuesto
    presupuesto_asignado: Optional[float]
    informacion_adicional: Optional[Dict] = {}
    objetivo_especificos: Optional[List[str]] = []

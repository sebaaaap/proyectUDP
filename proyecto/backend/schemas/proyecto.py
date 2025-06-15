from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import date
from enum import Enum
from schemas.archivos_proyecto_schemas import ArchivoProyectoResponse





class EstadoProyectoEnum(str, Enum):
    propuesto = "propuesto"
    en_desarrollo = "en_desarrollo"
    finalizado = "finalizado"

class InfoAdicional(BaseModel):
    justificacion: Optional[str] = None
    metodologia: Optional[str] = None
    impacto_academico: Optional[str] = None
    impacto_social: Optional[str] = None
    perfil_profesor: Optional[str] = None

class ProyectoBase(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=200)
    descripcion: Optional[str] = None
    problema: Optional[str] = None
    objetivo_general: Optional[str] = None
    area_conocimiento: Optional[str] = None
    estado: Optional[EstadoProyectoEnum] = EstadoProyectoEnum.propuesto


class ProyectoCreate(ProyectoBase):
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    presupuesto_asignado: Optional[float] = Field(None, ge=0)
    informacion_adicional: Optional[InfoAdicional] = Field(default_factory=InfoAdicional)
    objetivo_especificos: Optional[List[str]] = Field(default_factory=list)
    id_prof: Optional[int] = None
    id_estudiante_creador: Optional[int] = None

    @validator('fecha_fin')
    def validar_fechas(cls, v, values):
        if v and 'fecha_inicio' in values and v < values['fecha_inicio']:
            raise ValueError("La fecha de fin debe ser posterior a la de inicio")
        return v

class ProyectoResponse(ProyectoBase):
    id: int

    
    id_prof: Optional[int]
    id_estudiante_creador: Optional[int]
    archivos: List[ArchivoProyectoResponse] = []

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.isoformat(),
            Dict: lambda v: dict(v),
        }
        


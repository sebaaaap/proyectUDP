from fastapi import APIRouter, Depends, Query
from database.db import get_db
from models.proyecto import Proyecto
from models.profesor import Profesor
from models.estudiante import Estudiante
from sqlalchemy.orm import joinedload
from typing import Optional

router = APIRouter()

@router.get("/proyectos/filtrar")
def filtrar_proyectos(
    area: Optional[str] = Query(None),
    profesor: Optional[int] = Query(None),
    carrera: Optional[str] = Query(None)
):
    db = get_db()
    try:
        query = db.query(Proyecto).options(joinedload(Proyecto.profesor), joinedload(Proyecto.estudiante))

        if area:
            query = query.filter(Proyecto.area_conocimiento == area)
        if profesor:
            query = query.filter(Proyecto.id_profesor == profesor)
        if carrera:
            query = query.join(Estudiante).filter(Estudiante.carrera == carrera)

        proyectos = query.all()
        resultados = [
            {
                "id": p.id,
                "titulo": p.titulo,
                "area": p.area_conocimiento,
                "profesor": p.profesor.nombre if p.profesor else None,
                "carrera_estudiante": p.estudiante.carrera if p.estudiante else None
            }
            for p in proyectos
        ]

        return {"resultados": resultados}
    finally:
        db.close()
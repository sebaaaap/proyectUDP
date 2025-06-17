# controllers/ranking_controller.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database.db import get_db
from models.voto import Voto
from models.proyecto import Proyecto
from models.profesor import Profesor
from pydantic import BaseModel
from typing import List

router = APIRouter()

class VotoRequest(BaseModel):
    id_proyecto: int
    id_profesor: int

class ProyectoRanking(BaseModel):
    id: int
    titulo: str
    descripcion: str
    votos_count: int
    profesor_creador: str
    area_conocimiento: str

class RankingResponse(BaseModel):
    proyectos: List[ProyectoRanking]
    total_proyectos: int

@router.post("/votar")
async def votar_proyecto(voto_data: VotoRequest, db: Session = Depends(get_db)):
    """
    Permite a un profesor votar por un proyecto (solo una vez por proyecto)
    """
    # Verificar si el profesor ya votó por este proyecto
    voto_existente = db.query(Voto).filter(
        Voto.id_proyecto == voto_data.id_proyecto,
        Voto.id_profesor == voto_data.id_profesor,
        Voto.activo == True
    ).first()
    
    if voto_existente:
        raise HTTPException(
            status_code=400, 
            detail="Ya has votado por este proyecto"
        )
    
    # Verificar que el proyecto existe
    proyecto = db.query(Proyecto).filter(Proyecto.id == voto_data.id_proyecto).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Verificar que el profesor existe
    profesor = db.query(Profesor).filter(Profesor.id == voto_data.id_profesor).first()
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    
    # Crear el voto
    nuevo_voto = Voto(
        id_proyecto=voto_data.id_proyecto,
        id_profesor=voto_data.id_profesor
    )
    
    db.add(nuevo_voto)
    db.commit()
    
    return {"message": "Voto registrado exitosamente"}

@router.delete("/votar/{id_proyecto}/{id_profesor}")
async def quitar_voto(id_proyecto: int, id_profesor: int, db: Session = Depends(get_db)):
    """
    Permite a un profesor quitar su voto de un proyecto
    """
    voto = db.query(Voto).filter(
        Voto.id_proyecto == id_proyecto,
        Voto.id_profesor == id_profesor,
        Voto.activo == True
    ).first()
    
    if not voto:
        raise HTTPException(status_code=404, detail="Voto no encontrado")
    
    # Marcar como inactivo en lugar de eliminar (para auditoría)
    voto.activo = False
    db.commit()
    
    return {"message": "Voto eliminado exitosamente"}

@router.get("/ranking", response_model=RankingResponse)
async def obtener_ranking(db: Session = Depends(get_db)):
    """
    Obtiene el ranking de proyectos ordenado por cantidad de votos
    """
    ranking_query = db.query(
        Proyecto.id,
        Proyecto.titulo,
        Proyecto.descripcion,
        Proyecto.area_conocimiento,
        func.count(Voto.id).label('votos_count'),
        func.concat(Profesor.nombre1, ' ', Profesor.apellido1).label('profesor_creador')
    ).outerjoin(
        Voto, (Voto.id_proyecto == Proyecto.id) & (Voto.activo == True)
    ).join(
        Profesor, Profesor.id == Proyecto.id_prof
    ).group_by(
        Proyecto.id, Proyecto.titulo, Proyecto.descripcion, 
        Proyecto.area_conocimiento, Profesor.nombre1, Profesor.apellido1
    ).order_by(
        desc('votos_count'), Proyecto.titulo
    ).all()
    
    proyectos_ranking = [
        ProyectoRanking(
            id=proyecto.id,
            titulo=proyecto.titulo,
            descripcion=proyecto.descripcion[:200] + "..." if len(proyecto.descripcion) > 200 else proyecto.descripcion,
            votos_count=proyecto.votos_count,
            profesor_creador=proyecto.profesor_creador,
            area_conocimiento=proyecto.area_conocimiento
        )
        for proyecto in ranking_query
    ]
    
    return RankingResponse(
        proyectos=proyectos_ranking,
        total_proyectos=len(proyectos_ranking)
    )

@router.get("/mis-votos/{id_profesor}")
async def obtener_mis_votos(id_profesor: int, db: Session = Depends(get_db)):
    """
    Obtiene los proyectos que ha votado un profesor específico
    """
    votos = db.query(
        Voto.id_proyecto,
        Proyecto.titulo,
        Voto.fecha_voto
    ).join(
        Proyecto, Proyecto.id == Voto.id_proyecto
    ).filter(
        Voto.id_profesor == id_profesor,
        Voto.activo == True
    ).all()
    
    return [
        {
            "id_proyecto": voto.id_proyecto,
            "titulo_proyecto": voto.titulo,
            "fecha_voto": voto.fecha_voto
        }
        for voto in votos
    ]

@router.get("/estadisticas-votos")
async def obtener_estadisticas(db: Session = Depends(get_db)):
    """
    Obtiene estadísticas generales de votación
    """
    total_votos = db.query(func.count(Voto.id)).filter(Voto.activo == True).scalar()
    total_proyectos_con_votos = db.query(func.count(func.distinct(Voto.id_proyecto))).filter(Voto.activo == True).scalar()
    total_profesores_votantes = db.query(func.count(func.distinct(Voto.id_profesor))).filter(Voto.activo == True).scalar()
    
    return {
        "total_votos": total_votos,
        "total_proyectos_con_votos": total_proyectos_con_votos,
        "total_profesores_votantes": total_profesores_votantes
    }
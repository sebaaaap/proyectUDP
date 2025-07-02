# controllers/ranking.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, and_, func
from database.db import get_db
from models.ranking_model import ProyectoRanking, VotoRanking
from models.proyecto_model import Proyecto
from models.user_model import Usuario, RolEnum, Profesor
from helpers.jwtAuth import verificar_token
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()

class VotoRequest(BaseModel):
    voto_positivo: bool

class ProyectoRankingResponse(BaseModel):
    id: int
    proyecto_id: int
    titulo: str
    resumen: str
    calificacion_final: float
    puntuacion_neta: int
    total_votos_positivos: int
    total_votos_negativos: int
    total_votos: int
    creador_nombre: str
    profesor_nombre: str
    facultad: Optional[str]
    fecha_ingreso: str
    ya_vote: bool = False
    mi_voto: Optional[bool] = None
    posicion: int

# CORREGIDO: Endpoint para obtener proyectos en el ranking
@router.get("/", response_model=List[ProyectoRankingResponse])
def obtener_ranking(
    facultad: Optional[str] = Query(None, description="Filtrar por facultad"),
    limite: int = Query(50, le=100, description="Límite de proyectos a mostrar"),
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Query base para proyectos en ranking activos con calificación >= 6.0
    query = (
        db.query(ProyectoRanking)
        .join(Proyecto)
        .filter(
            ProyectoRanking.activo == True,
            ProyectoRanking.calificacion_final >= 6.0
        )
        .options(
            joinedload(ProyectoRanking.proyecto).joinedload(Proyecto.creador),
            joinedload(ProyectoRanking.proyecto).joinedload(Proyecto.profesor),
            joinedload(ProyectoRanking.votos).joinedload(VotoRanking.profesor)
        )
    )

    # Filtro por facultad si se especifica
    if facultad:
        query = query.join(Profesor, Profesor.id == Proyecto.profesor_id).filter(
            Profesor.facultad == facultad
        )

    # Obtener todos los proyectos y ordenarlos por puntuación neta
    proyectos_ranking = query.all()
    
    # Ordenar por puntuación neta (descendente) y luego por fecha de ingreso (ascendente para empates)
    proyectos_ordenados = sorted(
        proyectos_ranking, 
        key=lambda p: (-p.puntuacion_neta, p.fecha_ingreso)
    )
    
    # Aplicar límite
    proyectos_ordenados = proyectos_ordenados[:limite]

    resultado = []
    for posicion, pr in enumerate(proyectos_ordenados, 1):
        # Verificar si el usuario ya votó (solo si es profesor)
        ya_vote = False
        mi_voto = None
        if usuario_db.rol == RolEnum.profesor:
            voto_existente = db.query(VotoRanking).filter(
                VotoRanking.proyecto_ranking_id == pr.id,
                VotoRanking.profesor_id == usuario_db.id,
                VotoRanking.activo == True
            ).first()
            if voto_existente:
                ya_vote = True
                mi_voto = voto_existente.voto_positivo

        # Obtener información del profesor
        profesor_info = db.query(Profesor).filter(Profesor.id == pr.proyecto.profesor_id).first()

        resultado.append(ProyectoRankingResponse(
            id=pr.id,
            proyecto_id=pr.proyecto_id,
            titulo=pr.proyecto.titulo,
            resumen=pr.proyecto.resumen or "Sin resumen disponible",
            calificacion_final=pr.calificacion_final,
            puntuacion_neta=pr.puntuacion_neta,
            total_votos_positivos=pr.total_votos_positivos,
            total_votos_negativos=pr.total_votos_negativos,
            total_votos=pr.total_votos,
            creador_nombre=f"{pr.proyecto.creador.nombre} {pr.proyecto.creador.apellido}",
            profesor_nombre=f"{pr.proyecto.profesor.nombre} {pr.proyecto.profesor.apellido}",
            facultad=profesor_info.facultad if profesor_info else None,
            fecha_ingreso=pr.fecha_ingreso.isoformat(),
            ya_vote=ya_vote,
            mi_voto=mi_voto,
            posicion=posicion
        ))

    return resultado

# CORREGIDO: Endpoint para votar en el ranking (solo profesores)
@router.post("/{proyecto_ranking_id}/votar")
def votar_proyecto(
    proyecto_ranking_id: int,
    voto_data: VotoRequest,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    
    # Verificar que es profesor
    if not usuario_db or usuario_db.rol != RolEnum.profesor:
        raise HTTPException(status_code=403, detail="Solo profesores pueden votar")

    # Verificar que el proyecto existe en el ranking
    proyecto_ranking = db.query(ProyectoRanking).filter(
        ProyectoRanking.id == proyecto_ranking_id,
        ProyectoRanking.activo == True
    ).first()
    
    if not proyecto_ranking:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado en el ranking")

    # Buscar voto existente
    voto_existente = db.query(VotoRanking).filter(
        VotoRanking.proyecto_ranking_id == proyecto_ranking_id,
        VotoRanking.profesor_id == usuario_db.id
    ).first()

    if voto_existente:
        # Si ya votó, actualizar el voto
        if voto_existente.activo and voto_existente.voto_positivo == voto_data.voto_positivo:
            # Si intenta votar igual que antes, remover el voto (como Reddit)
            voto_existente.activo = False
            mensaje = "Voto removido"
        else:
            # Cambiar el voto o reactivarlo
            voto_existente.voto_positivo = voto_data.voto_positivo
            voto_existente.fecha_voto = datetime.utcnow()
            voto_existente.activo = True
            mensaje = f"Voto actualizado a {'positivo' if voto_data.voto_positivo else 'negativo'}"
    else:
        # Crear nuevo voto
        nuevo_voto = VotoRanking(
            proyecto_ranking_id=proyecto_ranking_id,
            profesor_id=usuario_db.id,
            voto_positivo=voto_data.voto_positivo
        )
        db.add(nuevo_voto)
        mensaje = f"Voto {'positivo' if voto_data.voto_positivo else 'negativo'} registrado"

    db.commit()
    
    # Obtener nueva puntuación
    db.refresh(proyecto_ranking)
    
    return {
        "mensaje": mensaje,
        "voto_positivo": voto_data.voto_positivo,
        "puntuacion_neta": proyecto_ranking.puntuacion_neta,
        "total_votos": proyecto_ranking.total_votos
    }

# CORREGIDO: Endpoint para agregar proyecto al ranking
@router.post("/agregar/{proyecto_id}")
def agregar_al_ranking(
    proyecto_id: int,
    calificacion: float,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    
    # Solo profesores pueden calificar
    if not usuario_db or usuario_db.rol != RolEnum.profesor:
        raise HTTPException(status_code=403, detail="Solo profesores pueden calificar proyectos")

    # Verificar que el proyecto existe
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Verificar que es el profesor asignado
    if proyecto.profesor_id != usuario_db.id:
        raise HTTPException(status_code=403, detail="Solo el profesor asignado puede calificar este proyecto")

    # Validar calificación (debe estar entre 1.0 y 7.0)
    if calificacion < 1.0 or calificacion > 7.0:
        raise HTTPException(status_code=400, detail="La calificación debe estar entre 1.0 y 7.0")
    
    # Verificar si ya existe en el ranking
    ranking_existente = db.query(ProyectoRanking).filter(
        ProyectoRanking.proyecto_id == proyecto_id
    ).first()
    
    if calificacion >= 6.0:
        # Si califica para el ranking (>= 6.0)
        if not ranking_existente:
            # Crear nuevo registro en ranking
            nuevo_ranking = ProyectoRanking(
                proyecto_id=proyecto_id,
                calificacion_final=calificacion,
                activo=True
            )
            db.add(nuevo_ranking)
            mensaje = f"Proyecto calificado con {calificacion:.1f} y agregado al ranking"
        else:
            # Actualizar registro existente
            ranking_existente.calificacion_final = calificacion
            ranking_existente.activo = True
            mensaje = f"Proyecto calificado con {calificacion:.1f} y actualizado en el ranking"
    else:
        # Si no califica para el ranking (< 6.0)
        if ranking_existente:
            ranking_existente.activo = False
        mensaje = f"Proyecto calificado con {calificacion:.1f} (no califica para ranking - mínimo 6.0)"

    db.commit()
    return {"mensaje": mensaje, "calificacion": calificacion}

# CORREGIDO: Endpoint para obtener facultades disponibles
@router.get("/facultades", response_model=List[str])
def obtener_facultades(db: Session = Depends(get_db)):
    """Obtiene lista de facultades para filtros"""
    facultades = (
        db.query(Profesor.facultad)
        .distinct()
        .filter(Profesor.facultad.isnot(None))
        .order_by(Profesor.facultad)
        .all()
    )
    return [f.facultad for f in facultades if f.facultad]

# CORREGIDO: Endpoint para obtener estadísticas del ranking
@router.get("/estadisticas")
def obtener_estadisticas_ranking(
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Obtiene estadísticas generales del ranking"""
    total_proyectos = db.query(ProyectoRanking).filter(
        ProyectoRanking.activo == True,
        ProyectoRanking.calificacion_final >= 6.0
    ).count()
    
    total_votos = db.query(VotoRanking).filter(VotoRanking.activo == True).count()
    
    promedio_calificacion = db.query(func.avg(ProyectoRanking.calificacion_final)).filter(
        ProyectoRanking.activo == True,
        ProyectoRanking.calificacion_final >= 6.0
    ).scalar()
    
    return {
        "total_proyectos_ranking": total_proyectos,
        "total_votos": total_votos,
        "promedio_calificacion": round(promedio_calificacion, 2) if promedio_calificacion else 0
    }
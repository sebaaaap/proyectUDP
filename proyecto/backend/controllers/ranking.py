# controllers/ranking.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, and_
from database.db import get_db
from models.ranking_model import ProyectoRanking, VotoRanking
from models.proyecto_model import Proyecto
from models.user_model import Usuario, RolEnum, Profesor
from helpers.jwtAuth import verificar_token
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class VotoRequest(BaseModel):
    voto_positivo: bool

class ProyectoRankingResponse(BaseModel):
    id: int
    titulo: str
    descripcion: str
    resumen: str
    calificacion_final: float
    total_votos: int
    puntuacion_ranking: int
    creador_nombre: str
    profesor_nombre: str
    facultad: Optional[str]
    ya_vote: bool = False
    mi_voto: Optional[bool] = None

# Endpoint para obtener proyectos en el ranking
@router.get("/ranking", response_model=List[ProyectoRankingResponse])
def obtener_ranking(
    facultad: Optional[str] = Query(None),
    limite: int = Query(50, le=100),
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Query base para proyectos en ranking
    query = (
        db.query(ProyectoRanking)
        .join(Proyecto)
        .filter(
            ProyectoRanking.activo == True,
            Proyecto.calificacion_final >= 6.0
        )
        .options(
            joinedload(ProyectoRanking.proyecto).joinedload(Proyecto.creador),
            joinedload(ProyectoRanking.proyecto).joinedload(Proyecto.profesor),
            joinedload(ProyectoRanking.votos)
        )
    )

    # Filtro por facultad si se especifica
    if facultad:
        query = query.join(Profesor, Profesor.id == Proyecto.profesor_id).filter(
            Profesor.facultad == facultad
        )

    # Ordenar por puntuación (descendente) y luego por fecha de ingreso
    proyectos_ranking = (
        query.order_by(desc(ProyectoRanking.puntuacion_ranking), ProyectoRanking.fecha_ingreso)
        .limit(limite)
        .all()
    )

    resultado = []
    for pr in proyectos_ranking:
        # Verificar si el usuario ya votó
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
            titulo=pr.proyecto.titulo,
            descripcion=pr.proyecto.descripcion,
            resumen=pr.proyecto.resumen,
            calificacion_final=pr.calificacion_final,
            total_votos=pr.total_votos,
            puntuacion_ranking=pr.puntuacion_ranking,
            creador_nombre=f"{pr.proyecto.creador.nombre} {pr.proyecto.creador.apellido}",
            profesor_nombre=f"{pr.proyecto.profesor.nombre} {pr.proyecto.profesor.apellido}",
            facultad=profesor_info.facultad if profesor_info else None,
            ya_vote=ya_vote,
            mi_voto=mi_voto
        ))

    return resultado

# Endpoint para votar en el ranking (solo profesores)
@router.post("/ranking/{proyecto_ranking_id}/votar")
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

    # Verificar que no haya votado antes
    voto_existente = db.query(VotoRanking).filter(
        VotoRanking.proyecto_ranking_id == proyecto_ranking_id,
        VotoRanking.profesor_id == usuario_db.id,
        VotoRanking.activo == True
    ).first()

    if voto_existente:
        # Actualizar voto existente
        voto_existente.voto_positivo = voto_data.voto_positivo
        voto_existente.fecha_voto = datetime.utcnow()
    else:
        # Crear nuevo voto
        nuevo_voto = VotoRanking(
            proyecto_ranking_id=proyecto_ranking_id,
            profesor_id=usuario_db.id,
            voto_positivo=voto_data.voto_positivo
        )
        db.add(nuevo_voto)

    db.commit()
    
    return {
        "mensaje": "Voto registrado correctamente",
        "voto_positivo": voto_data.voto_positivo
    }

# Endpoint para agregar proyecto al ranking (automático cuando se califica con 6+)
@router.post("/ranking/agregar/{proyecto_id}")
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
        raise HTTPException(status_code=403, detail="Solo el profesor asignado puede calificar")

    # Actualizar calificación del proyecto
    proyecto.calificacion_final = calificacion
    
    # Si la calificación es >= 6.0, agregar al ranking
    if calificacion >= 6.0:
        # Verificar si ya está en el ranking
        ranking_existente = db.query(ProyectoRanking).filter(
            ProyectoRanking.proyecto_id == proyecto_id
        ).first()
        
        if not ranking_existente:
            nuevo_ranking = ProyectoRanking(
                proyecto_id=proyecto_id,
                calificacion_final=calificacion
            )
            db.add(nuevo_ranking)
            mensaje = f"Proyecto calificado con {calificacion} y agregado al ranking"
        else:
            ranking_existente.calificacion_final = calificacion
            ranking_existente.activo = True
            mensaje = f"Proyecto calificado con {calificacion} y actualizado en el ranking"
    else:
        # Si la calificación es < 6.0, remover del ranking si estaba
        ranking_existente = db.query(ProyectoRanking).filter(
            ProyectoRanking.proyecto_id == proyecto_id
        ).first()
        if ranking_existente:
            ranking_existente.activo = False
        mensaje = f"Proyecto calificado con {calificacion} (no califica para ranking)"

    db.commit()
    return {"mensaje": mensaje}

# Endpoint para obtener facultades disponibles
@router.get("/ranking/facultades")
def obtener_facultades(db: Session = Depends(get_db)):
    facultades = (
        db.query(Profesor.facultad)
        .distinct()
        .filter(Profesor.facultad.isnot(None))
        .all()
    )
    return [f.facultad for f in facultades if f.facultad]
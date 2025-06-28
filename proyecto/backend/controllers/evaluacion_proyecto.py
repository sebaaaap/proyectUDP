# Agregar estas funciones a tu archivo evaluacion_proyecto.py existente

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Proyecto, ProyectoRanking, Usuario, Profesor, Postulacion
from schemas import ProyectoCalificacionRequest, ProyectoResponse, ProyectoCalificacionResponse
from auth import get_current_user  # Asumiendo que tienes este import
import datetime

# Agregar estas rutas a tu router existente en evaluacion_proyecto.py

@router.get("/profesor/mis-proyectos", response_model=List[ProyectoResponse])
async def obtener_proyectos_profesor(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los proyectos asignados al profesor actual para evaluación
    """
    # Verificar que el usuario es un profesor
    profesor = db.query(Profesor).filter(Profesor.usuario_id == current_user.id).first()
    if not profesor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesores pueden acceder a esta función"
        )
    
    # Obtener proyectos asignados al profesor
    proyectos = db.query(Proyecto).filter(
        Proyecto.profesor_asignado_id == profesor.id
    ).all()
    
    # Convertir a formato de respuesta con información adicional
    proyectos_response = []
    for proyecto in proyectos:
        # Contar postulaciones
        postulaciones_pendientes = db.query(Postulacion).filter(
            Postulacion.proyecto_id == proyecto.id,
            Postulacion.estado == "pendiente"
        ).count()
        
        postulaciones_aceptadas = db.query(Postulacion).filter(
            Postulacion.proyecto_id == proyecto.id,
            Postulacion.estado == "aceptada"
        ).count()
        
        # Obtener calificación si existe
        ranking_entry = db.query(ProyectoRanking).filter(
            ProyectoRanking.proyecto_id == proyecto.id
        ).first()
        
        proyecto_data = {
            "id": proyecto.id,
            "titulo": proyecto.titulo,
            "descripcion": proyecto.descripcion,
            "estado": proyecto.estado,
            "fecha_creacion": proyecto.fecha_creacion,
            "creador": {
                "nombre": f"{proyecto.creador.nombre} {proyecto.creador.apellido}",
                "email": proyecto.creador.email
            },
            "postulaciones_pendientes": postulaciones_pendientes,
            "postulaciones_aceptadas": postulaciones_aceptadas,
            "calificacion": ranking_entry.calificacion if ranking_entry else None,
            "comentarios_profesor": ranking_entry.comentarios if ranking_entry else None
        }
        proyectos_response.append(proyecto_data)
    
    return proyectos_response

@router.post("/calificar/{proyecto_id}", response_model=ProyectoCalificacionResponse)
async def calificar_proyecto(
    proyecto_id: int,
    calificacion_data: ProyectoCalificacionRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Califica un proyecto y lo agrega al ranking si la nota es >= 6.0
    """
    # Verificar que el usuario es un profesor
    profesor = db.query(Profesor).filter(Profesor.usuario_id == current_user.id).first()
    if not profesor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesores pueden calificar proyectos"
        )
    
    # Verificar que el proyecto existe y está asignado al profesor
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.profesor_asignado_id == profesor.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado o no asignado a este profesor"
        )
    
    # Verificar que el proyecto está en estado "en_revision"
    if proyecto.estado != "en_revision":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se pueden calificar proyectos en estado 'en_revision'"
        )
    
    try:
        # Actualizar estado del proyecto
        nuevo_estado = "calificado" if calificacion_data.calificacion >= 6.0 else "rechazado"
        proyecto.estado = nuevo_estado
        proyecto.fecha_calificacion = datetime.datetime.now()
        
        # Si la calificación es >= 6.0, agregar al ranking
        if calificacion_data.calificacion >= 6.0:
            # Verificar si ya existe una entrada en el ranking
            ranking_existente = db.query(ProyectoRanking).filter(
                ProyectoRanking.proyecto_id == proyecto_id
            ).first()
            
            if ranking_existente:
                # Actualizar entrada existente
                ranking_existente.calificacion = calificacion_data.calificacion
                ranking_existente.comentarios = calificacion_data.comentarios
                ranking_existente.fecha_calificacion = datetime.datetime.now()
            else:
                # Crear nueva entrada en el ranking
                nueva_entrada_ranking = ProyectoRanking(
                    proyecto_id=proyecto_id,
                    calificacion=calificacion_data.calificacion,
                    comentarios=calificacion_data.comentarios,
                    fecha_calificacion=datetime.datetime.now(),
                    profesor_id=profesor.id
                )
                db.add(nueva_entrada_ranking)
        
        # Guardar cambios
        db.commit()
        db.refresh(proyecto)
        
        return {
            "mensaje": f"Proyecto calificado correctamente con nota {calificacion_data.calificacion}",
            "proyecto_id": proyecto_id,
            "calificacion": calificacion_data.calificacion,
            "estado": nuevo_estado,
            "agregado_al_ranking": calificacion_data.calificacion >= 6.0
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al calificar el proyecto: {str(e)}"
        )

@router.patch("/proyecto/{proyecto_id}/estado")
async def actualizar_estado_proyecto(
    proyecto_id: int,
    estado_data: dict,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Actualiza el estado de un proyecto (aprobar/rechazar propuestas)
    """
    # Verificar que el usuario es un profesor
    profesor = db.query(Profesor).filter(Profesor.usuario_id == current_user.id).first()
    if not profesor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesores pueden actualizar estados de proyectos"
        )
    
    # Verificar que el proyecto existe y está asignado al profesor
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.profesor_asignado_id == profesor.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado o no asignado a este profesor"
        )
    
    nuevo_estado = estado_data.get("estado")
    if nuevo_estado not in ["aprobado", "rechazado", "en_revision"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado no válido"
        )
    
    try:
        proyecto.estado = nuevo_estado
        proyecto.fecha_actualizacion = datetime.datetime.now()
        
        db.commit()
        db.refresh(proyecto)
        
        return {
            "mensaje": f"Proyecto {nuevo_estado} correctamente",
            "proyecto_id": proyecto_id,
            "nuevo_estado": nuevo_estado
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el proyecto: {str(e)}"
        )
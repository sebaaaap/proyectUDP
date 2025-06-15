from datetime import datetime
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from services import ProyectoService
from repository.proyecto_repository import ProyectoRepository
from schemas import ProyectoCreate, ProyectoResponse
from database.db import get_db
import logging
import uuid
import os
from pathlib import Path
from typing import List
from models.proyecto import Proyecto
from models.archivos_proyecto import ArchivoProyecto
from models.participacion import Participacion, EstadoParticipacionEnum
from models.estudiante import Estudiante
logger = logging.getLogger(__name__)
UPLOAD_FOLDER = Path("/app/uploads")  # Ruta dentro del contenedor
UPLOAD_FOLDER.mkdir(exist_ok=True)
BASE_URL = "http://localhost:8000"  # Cambiar según tu configuración




router = APIRouter()

@router.post("/", response_model=ProyectoResponse, status_code=status.HTTP_201_CREATED)
def crear_proyecto(
    proyecto: ProyectoCreate,
    db: Session = Depends(get_db)
):
    repo = ProyectoRepository(db)
    service = ProyectoService(repo)
    try:
        return service.crear_proyecto(proyecto)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
        
@router.get("/getall", response_model=list[ProyectoResponse])
def listar_proyectos(
    db: Session = Depends(get_db)
):
    repo = ProyectoRepository(db)
    service = ProyectoService(repo)
    return service.listar_proyectos()

@router.get("/{proyecto_id}", response_model=ProyectoResponse)
def leer_proyecto(
    proyecto_id: int,
    db: Session = Depends(get_db)
):
    repo = ProyectoRepository(db)
    service = ProyectoService(repo)
    return service.obtener_proyecto(proyecto_id)

@router.get("/estudiante/{id_estudiante}", response_model=list[ProyectoResponse])
def listar_proyectos_por_estudiante(id_estudiante: int, db: Session = Depends(get_db)):
    repo = ProyectoRepository(db)
    service = ProyectoService(repo)
    return service.listar_proyectos_por_estudiante(id_estudiante)

@router.post("/proyectos/{id_proyecto}/archivos")
async def subir_archivo_proyecto(
    id_proyecto: int,
    archivo: UploadFile = File(...),
    descripcion: str = Form(default="Sin descripción"),
    estudiante_id: int = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # 1. Validar tipos de archivo permitidos
        allowed_extensions = ['.pdf', '.zip']
        file_ext = os.path.splitext(archivo.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Solo se permiten archivos con extensiones: {', '.join(allowed_extensions)}"
            )

        # 2. Validar tamaño máximo (5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        file_size = 0
        
        # Leer el archivo en chunks para validar tamaño
        temp_file = io.BytesIO()
        while True:
            chunk = await archivo.read(8192)  # 8KB chunks
            if not chunk:
                break
            file_size += len(chunk)
            if file_size > max_size:
                raise HTTPException(
                    status_code=413,
                    detail=f"El archivo excede el tamaño máximo de {max_size//(1024*1024)}MB"
                )
            temp_file.write(chunk)
        
        # Resetear el puntero del archivo
        temp_file.seek(0)
        
        # 3. Generar nombre único y guardar
        unique_name = f"{uuid.uuid4().hex}{file_ext}"
        file_path = UPLOAD_FOLDER / unique_name
        
        with open(file_path, "wb") as f:
            f.write(temp_file.getvalue())
        
        # 4. Crear registro en DB
        nuevo_archivo = ArchivoProyecto(
            id_proyecto=id_proyecto,
            id_estudiante=estudiante_id,
            nombre_archivo=archivo.filename,
            tipo_archivo=archivo.content_type,
            url=f"{BASE_URL}/archivos/{unique_name}",
            descripcion=descripcion,
            fecha_subida=datetime.utcnow()
        )
        
        db.add(nuevo_archivo)
        db.commit()
        db.refresh(nuevo_archivo)

        return {
            "id": nuevo_archivo.id,
            "nombre": nuevo_archivo.nombre_archivo,
            "url": nuevo_archivo.url,
            "descripcion": nuevo_archivo.descripcion,
            "fecha_subida": nuevo_archivo.fecha_subida.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error subiendo archivo: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Error interno al procesar el archivo"
        )

@router.get("/{id_proyecto}/archivos", response_model=List[dict])
async def listar_archivos_proyecto(
    id_proyecto: int,
    db: Session = Depends(get_db)
):
    try:
        archivos = db.query(ArchivoProyecto).filter(
            ArchivoProyecto.id_proyecto == id_proyecto
        ).all()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=[{
                "id": archivo.id,
                "nombre": archivo.nombre_archivo,
                "url": archivo.url,
                "descripcion": archivo.descripcion,
                "fecha_subida": archivo.fecha_subida.isoformat(),
                "estudiante_id": archivo.id_estudiante
            } for archivo in archivos]
        )
        
    except Exception as e:
        logger.error(f"Error listando archivos: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Error interno al listar archivos"
        )

@router.get("/{id_proyecto}/archivos/{id_archivo}/descargar")
async def descargar_archivo(
    id_proyecto: int,
    id_archivo: int,
    db: Session = Depends(get_db)
):
    try:
        archivo = db.query(ArchivoProyecto).filter(
            ArchivoProyecto.id == id_archivo,
            ArchivoProyecto.id_proyecto == id_proyecto
        ).first()

        if not archivo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Archivo no encontrado"
            )

        unique_filename = archivo.url.split("/")[-1]
        file_path = UPLOAD_FOLDER / unique_filename

        if not file_path.is_file():
            logger.error(f"Archivo {file_path} no encontrado en el servidor")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="El archivo no existe en el servidor"
            )

        return FileResponse(
            path=file_path,
            filename=archivo.nombre_archivo,
            media_type=archivo.tipo_archivo
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error descargando archivo: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Error interno al descargar archivo"
        )


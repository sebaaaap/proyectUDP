from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from services import ProyectoService
from repository.proyecto_repository import ProyectoRepository
from schemas import ProyectoCreate, ProyectoResponse
from database.db import get_db



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

@router.get("/{proyecto_id}", response_model=ProyectoResponse)
def leer_proyecto(
    proyecto_id: int,
    db: Session = Depends(get_db)
):
    repo = ProyectoRepository(db)
    service = ProyectoService(repo)
    return service.obtener_proyecto(proyecto_id)

# @router.patch("/{proyecto_id}", response_model=ProyectoResponse)
# def actualizar_proyecto(
#     proyecto_id: int,
#     proyecto: ProyectoUpdate,
#     db: Session = Depends(get_db)
# ):
#     repo = ProyectoRepository(db)
#     service = ProyectoService(repo)
#     return service.actualizar_proyecto(proyecto_id, proyecto)

# @router.delete("/{proyecto_id}", status_code=status.HTTP_204_NO_CONTENT)
# def eliminar_proyecto(
#     proyecto_id: int,
#     db: Session = Depends(get_db)
# ):
#     repo = ProyectoRepository(db)
#     proyecto = repo.obtener_proyecto_por_id(proyecto_id)
#     if not proyecto:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Proyecto no encontrado"
#         )
    
#     db.delete(proyecto)
#     db.commit()
#     return JSONResponse(content=None, status_code=status.HTTP_204_NO_CONTENT)
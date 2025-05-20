from repository.proyecto_repository import ProyectoRepository
from schemas.proyecto import ProyectoCreate
from fastapi import HTTPException, status

class ProyectoService:
    def __init__(self, repository: ProyectoRepository):
        self.repository = repository

    def crear_proyecto(self, proyecto: ProyectoCreate):
        proyecto_data = proyecto.model_dump(exclude_unset=True)
        
        # Validación adicional de negocio
        if proyecto.fecha_fin and proyecto.fecha_inicio and proyecto.fecha_fin < proyecto.fecha_inicio:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La fecha de fin no puede ser anterior a la de inicio"
            )
        
        return self.repository.crear_proyecto(proyecto_data)

    def obtener_proyecto(self, proyecto_id: int):
        proyecto = self.repository.obtener_proyecto_por_id(proyecto_id)
        if not proyecto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        return proyecto

    # def actualizar_proyecto(self, proyecto_id: int, proyecto: ProyectoUpdate):
    #     update_data = proyecto.model_dump(exclude_unset=True)
    #     return self.repository.actualizar_proyecto(proyecto_id, update_data)
from sqlalchemy.orm import Session
from models.proyecto import Proyecto
from models.participacion import Participacion
from datetime import datetime

class ProyectoRepository:
    def __init__(self, db: Session):
        self.db = db

    def crear_proyecto(self, proyecto_data: dict):
        # Convertir fechas de string a date (si vienen del front)
        if 'fecha_inicio' in proyecto_data and isinstance(proyecto_data['fecha_inicio'], str):
            proyecto_data['fecha_inicio'] = datetime.strptime(proyecto_data['fecha_inicio'], '%Y-%m-%d').date()
        if 'fecha_fin' in proyecto_data and isinstance(proyecto_data['fecha_fin'], str):
            proyecto_data['fecha_fin'] = datetime.strptime(proyecto_data['fecha_fin'], '%Y-%m-%d').date()
        
        proyecto = Proyecto(**proyecto_data)
        self.db.add(proyecto)
        self.db.commit()
        self.db.refresh(proyecto)
        return proyecto

    def obtener_proyecto_por_id(self, proyecto_id: int):
        return self.db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()

    # def actualizar_proyecto(self, proyecto_id: int, update_data: dict):
    #     proyecto = self.db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    #     if not proyecto:
    #         return None
        
    #     for key, value in update_data.items():
    #         setattr(proyecto, key, value)
        
    #     self.db.commit()
    #     self.db.refresh(proyecto)
    #     return proyectos
    
    def listar_proyectos(self):
        return self.db.query(Proyecto).all()
    
    def obtener_proyectos_por_estudiante(self, id_estudiante: int):
        return (
            self.db.query(Proyecto)
            .join(Participacion, Proyecto.id == Participacion.id_proyecto)
            .filter(Participacion.id_estudiante == id_estudiante)
            .all()
        )
        
    def obtener_archivos_por_proyecto(self, id_proyecto: int):
        proyecto = self.db.query(Proyecto).filter(Proyecto.id == id_proyecto).first()
        if not proyecto:
            return None
        return proyecto.archivos if proyecto.archivos else []

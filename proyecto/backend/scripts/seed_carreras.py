from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.carrera_model import Carrera

def seed_carreras():
    db = SessionLocal()
    try:
        # Lista de carreras de ejemplo
        carreras = [
            {"nombre": "Ingeniería Civil Informática", "facultad": "Ingeniería"},
            {"nombre": "Ingeniería Civil Industrial", "facultad": "Ingeniería"},
            {"nombre": "Ingeniería Civil Mecánica", "facultad": "Ingeniería"},
            {"nombre": "Ingeniería Civil Eléctrica", "facultad": "Ingeniería"},
            {"nombre": "Ingeniería Civil Química", "facultad": "Ingeniería"},
            {"nombre": "Ingeniería Civil en Obras Civiles", "facultad": "Ingeniería"},
            {"nombre": "Derecho", "facultad": "Derecho"},
            {"nombre": "Medicina", "facultad": "Medicina"},
            {"nombre": "Arquitectura", "facultad": "Arquitectura, Diseño y Estudios Urbanos"},
            {"nombre": "Diseño", "facultad": "Arquitectura, Diseño y Estudios Urbanos"},
            {"nombre": "Psicología", "facultad": "Psicología"},
            {"nombre": "Periodismo", "facultad": "Comunicación y Letras"},
            {"nombre": "Publicidad", "facultad": "Comunicación y Letras"},
            {"nombre": "Cine", "facultad": "Comunicación y Letras"},
            {"nombre": "Enfermería", "facultad": "Medicina"},
            {"nombre": "Kinesiología", "facultad": "Medicina"},
            {"nombre": "Nutrición y Dietética", "facultad": "Medicina"},
            {"nombre": "Odontología", "facultad": "Odontología"},
            {"nombre": "Fonoaudiología", "facultad": "Odontología"},
            {"nombre": "Tecnología Médica", "facultad": "Medicina"}
        ]

        # Verificar si ya existen carreras
        if db.query(Carrera).first() is None:
            # Insertar carreras
            for carrera_data in carreras:
                carrera = Carrera(**carrera_data)
                db.add(carrera)
            
            db.commit()
            print("Carreras insertadas exitosamente")
        else:
            print("Las carreras ya existen en la base de datos")

    except Exception as e:
        print(f"Error al insertar carreras: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_carreras() 
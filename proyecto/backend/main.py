from controllers.proyecto_filtro import router as proyecto_router
from controllers.evaluacion_proyecto import router as evaluacion_router

# main.py
from fastapi import FastAPI, Depends
from database.db import Base, engine,  SessionLocal
from controllers import register, login, proyecto_controller
import models  # Esto activa los modelos vía models/__init__.py

from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()
app.include_router(proyecto_router)
app.include_router(evaluacion_router)


# Base.metadata.drop_all(engine)
# Crear las tablas (si estás usando tu propio engine con SQLite o PostgreSQL)
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hola mundo"}

@app.get("/ping")
def ping(db: Session = Depends(get_db)):
    return {"status": "Conectado a Postgres 🎉"}





app.include_router(proyecto_controller.router, prefix="/proyectos", tags=["proyectos"])





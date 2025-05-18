from controllers.proyecto_filtro import router as proyecto_router
from controllers.evaluacion_proyecto import router as evaluacion_router

# main.py
from fastapi import FastAPI, Depends
from database.db import Base, engine,  SessionLocal
from controllers import register, login
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


Base.metadata.drop_all(engine)
# Crear las tablas (si estás usando tu propio engine con SQLite o PostgreSQL)
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hola mundo"}

@app.get("/ping")
def ping(db: Session = Depends(get_db)):
    return {"status": "Conectado a Postgres 🎉"}


app.include_router(register.router, prefix="/auth", tags=["Register"])
app.include_router(login.router, prefix="/auth", tags=["Login"])

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware  # Importa el middleware CORS
# from app.database.conexion import Base, engine
# from app.models.registro import RegistroModel
# from app.models.user import UserModel
# from app.models.pistol import PistolModel
# from app.models.registrorf import RegistroRFModel
# from app.controllers.registro import router as registro_router
# from app.controllers.user import router as user_router
# from app.controllers.pistol import router as pistol_router
# from app.controllers.registrorf import router as rf_router

# # Crea la instancia de FastAPI
# app = FastAPI()
app.include_router(proyecto_router)
app.include_router(evaluacion_router)


# # Configura CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Permite todos los orígenes (en desarrollo)
#     allow_credentials=True,
#     allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
#     allow_headers=["*"],  # Permite todos los headers
# )

# # Crea las tablas en la base de datos
# #imporatnte importalas, como arriba
# 

# @app.get("/")
# def read_root():
#     return {"chupalo"}

# # Monta las rutas
# # app.include_router(user_router, prefix="/adecco/users")
# # Monta las rutas
# app.include_router(user_router, prefix="/api/alumnos")
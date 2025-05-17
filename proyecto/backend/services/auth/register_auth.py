from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from utils import hash_contraseña
from fastapi import HTTPException

def registrar_usuario(usuario: UserCreate, db: Session):
    if db.query(User).filter_by(correo=usuario.correo).first():
        raise HTTPException(status_code=400, detail="Correo ya registrado")

    if db.query(User).filter_by(rut=usuario.rut).first():
        raise HTTPException(status_code=400, detail="RUT ya registrado")

    hashed_password = hash_contraseña(usuario.contraseña)
    nuevo_usuario = User(
        nombre=usuario.nombre,
        rut=usuario.rut,
        carrera=usuario.carrera,
        correo=usuario.correo,
        contraseña=hashed_password
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

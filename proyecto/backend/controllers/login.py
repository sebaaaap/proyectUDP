from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.user import UserLogin, UserResponse
from services.auth.login_auth import autenticar_usuario
from database.db import get_db

router = APIRouter()

@router.post("/login", response_model=UserResponse)
def login(datos: UserLogin, db: Session = Depends(get_db)):
    return autenticar_usuario(datos, db)

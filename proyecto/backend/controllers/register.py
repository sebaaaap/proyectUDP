# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from schemas.user import UserCreate, UserResponse
# from services.auth.register_auth import registrar_usuario 
# from database.db import get_db

# router = APIRouter()

# @router.post("/register", response_model=UserResponse)
# def register(usuario: UserCreate, db: Session = Depends(get_db)):
#     return registrar_usuario(usuario, db)

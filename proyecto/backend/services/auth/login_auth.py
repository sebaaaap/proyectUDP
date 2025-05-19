# from sqlalchemy.orm import Session
# from models.user_login import User
# from schemas.user import UserLogin
# from utils import verificar_contraseña
# from fastapi import HTTPException

# def autenticar_usuario(datos: UserLogin, db: Session):
#     usuario = db.query(User).filter_by(correo=datos.correo).first()
#     if not usuario or not verificar_contraseña(datos.contraseña, usuario.contraseña):
#         raise HTTPException(status_code=401, detail="Correo o contraseña inválidos")
#     return usuario

# from pydantic import BaseModel, EmailStr

# class UserCreate(BaseModel):
#     nombre: str
#     rut: str
#     carrera: str
#     correo: EmailStr
#     contraseña: str

# class UserLogin(BaseModel):
#     correo: EmailStr
#     contraseña: str

# class UserResponse(BaseModel):
#     id: int
#     nombre: str
#     rut: str
#     carrera: str
#     correo: EmailStr

#     class Config:
#         orm_mode = True

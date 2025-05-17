import bcrypt

def hash_contraseña(contraseña: str) -> str:
    return bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verificar_contraseña(contraseña: str, hashed: str) -> bool:
    return bcrypt.checkpw(contraseña.encode('utf-8'), hashed.encode('utf-8'))

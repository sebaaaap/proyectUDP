#!/usr/bin/env python3
"""
Script para verificar la configuración del backend
"""
import os
from dotenv import load_dotenv

def check_config():
    """Verifica que todas las variables de entorno necesarias estén configuradas"""
    load_dotenv()
    
    print("🔍 Verificando configuración del backend...")
    print("=" * 50)
    
    # Variables requeridas
    required_vars = {
        "GOOGLE_CLIENT_ID": "ID de cliente de Google OAuth",
        "GOOGLE_CLIENT_SECRET": "Secreto de cliente de Google OAuth", 
        "SECRET_KEY": "Clave secreta para JWT",
        "ALGORITHM": "Algoritmo para JWT",
        "DATABASE_URL": "URL de conexión a la base de datos"
    }
    
    all_good = True
    
    for var_name, description in required_vars.items():
        value = os.getenv(var_name)
        if not value:
            print(f"❌ {var_name}: NO CONFIGURADO - {description}")
            all_good = False
        elif "tu-" in value or "placeholder" in value.lower():
            print(f"⚠️  {var_name}: VALOR POR DEFECTO - {description}")
            print(f"   Valor actual: {value}")
            all_good = False
        else:
            # Ocultar valores sensibles
            if "SECRET" in var_name or "KEY" in var_name:
                masked_value = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
                print(f"✅ {var_name}: CONFIGURADO - {masked_value}")
            else:
                print(f"✅ {var_name}: CONFIGURADO")
    
    print("=" * 50)
    
    if all_good:
        print("🎉 ¡Todas las variables están configuradas correctamente!")
        return True
    else:
        print("❌ Hay variables sin configurar o con valores por defecto.")
        print("\n📝 Para configurar las variables:")
        print("1. Crea un archivo .env en la carpeta backend/")
        print("2. Copia el contenido de env_example.txt")
        print("3. Reemplaza los valores con tus credenciales reales")
        return False

if __name__ == "__main__":
    check_config() 
#!/bin/bash

echo "🧪 Probando Backend - Proyecto UDP"
echo "=================================="

# Detener todos los servicios
echo "1. Deteniendo servicios..."
sudo docker-compose down

# Limpiar
echo "2. Limpiando..."
sudo docker system prune -f

# Construir solo el backend
echo "3. Construyendo backend..."
sudo docker-compose build backend

# Iniciar solo el backend
echo "4. Iniciando backend..."
sudo docker-compose up -d backend

# Esperar
echo "5. Esperando a que el backend esté listo..."
sleep 10

# Verificar estado
echo "6. Verificando estado..."
sudo docker-compose ps

# Verificar puerto
echo "7. Verificando puerto 8000..."
if sudo netstat -tulpn | grep -q ":8000"; then
    echo "✅ Puerto 8000 está en uso"
    sudo netstat -tulpn | grep ":8000"
else
    echo "❌ Puerto 8000 NO está en uso"
fi

# Mostrar logs
echo "8. Logs del backend:"
sudo docker-compose logs backend

# Probar conexión
echo "9. Probando conexión..."
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Backend responde en http://localhost:8000"
    curl -s http://localhost:8000
else
    echo "❌ Backend NO responde en http://localhost:8000"
fi

echo ""
echo "🎯 Resultado del test completado" 
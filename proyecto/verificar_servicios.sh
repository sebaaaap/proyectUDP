#!/bin/bash

echo "🔍 Verificando estado de servicios..."
echo "====================================="

# Verificar si Docker está funcionando
echo "1. Verificando Docker..."
if sudo docker ps &> /dev/null; then
    echo "✅ Docker funciona con sudo"
else
    echo "❌ Docker no funciona"
    exit 1
fi

# Verificar contenedores
echo ""
echo "2. Verificando contenedores..."
sudo docker ps -a

# Verificar si los servicios están corriendo
echo ""
echo "3. Verificando servicios específicos..."
if sudo docker ps | grep -q "backend"; then
    echo "✅ Backend está ejecutándose"
else
    echo "❌ Backend NO está ejecutándose"
fi

if sudo docker ps | grep -q "frontend"; then
    echo "✅ Frontend está ejecutándose"
else
    echo "❌ Frontend NO está ejecutándose"
fi

if sudo docker ps | grep -q "db"; then
    echo "✅ Base de datos está ejecutándose"
else
    echo "❌ Base de datos NO está ejecutándose"
fi

# Verificar puertos
echo ""
echo "4. Verificando puertos..."
if sudo netstat -tulpn | grep -q ":8000"; then
    echo "✅ Puerto 8000 está en uso"
    sudo netstat -tulpn | grep ":8000"
else
    echo "❌ Puerto 8000 NO está en uso"
fi

if sudo netstat -tulpn | grep -q ":5173"; then
    echo "✅ Puerto 5173 está en uso"
    sudo netstat -tulpn | grep ":5173"
else
    echo "❌ Puerto 5173 NO está en uso"
fi

echo ""
echo "5. Logs del backend (últimas 20 líneas):"
sudo docker-compose logs --tail=20 backend

echo ""
echo "🎯 Recomendaciones:"
echo "   Si los servicios no están ejecutándose, ejecuta:"
echo "   sudo docker-compose up --build -d"
echo ""
echo "   Para ver logs completos:"
echo "   sudo docker-compose logs -f" 
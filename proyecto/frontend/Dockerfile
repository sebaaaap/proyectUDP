# Usa una imagen ligera de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias declaradas en package.json
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto del servidor de desarrollo (Vite)
EXPOSE 5173

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

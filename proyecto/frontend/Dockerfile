# Usa la imagen oficial de Node.js con la versión LTS
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package.json package-lock.json* ./

# Instala las dependencias
RUN npm ci --silent

# Copia el resto de los archivos del proyecto
COPY . .
RUN rm -rf node_modules && npm install

# Puerto que expone la aplicación (el mismo que usa Vite por defecto)
EXPOSE 5173

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
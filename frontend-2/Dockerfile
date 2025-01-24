# Dockerfile para el Frontend (React)
# Usa una imagen base de Node.js para construir el proyecto
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de la app
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Expone el puerto en el que corre la aplicación de desarrollo (puerto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación con npm start
CMD ["npm", "start"]

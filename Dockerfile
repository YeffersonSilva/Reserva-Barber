FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"] 
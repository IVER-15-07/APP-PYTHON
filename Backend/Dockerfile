# Usar imagen Node.js versión 18 (LTS recomendada) con alpine para tamaño pequeño
#FROM node:18-alpine
FROM node:18-slim

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# Instalar OpenSSL y dependencias necesarias para Prisma
# (luego limpiamos caches para imagen más pequeña)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     ca-certificates \
     openssl \
     libssl-dev \
     curl \
  && rm -rf /var/lib/apt/lists/*

# Copiar package.json y package-lock.json
# Esto se hace antes del código fuente para aprovechar caché de Docker
COPY package*.json ./
COPY prisma ./prisma

# Instalar TODAS las dependencias (incluyendo dev que necesita Prisma)
RUN npm ci

# Copiar todo el código de la aplicación
COPY . .

# Copiar schema.prisma (necesario para prisma generate)
#COPY prisma ./prisma

# Generar cliente Prisma (DEBE ser después de copiar prisma/)
RUN npx prisma generate

RUN npm prune --production

# Limpiar caché de npm
RUN npm cache clean --force

# Exponer el puerto donde escucha el backend
EXPOSE 5000

# Verificar que el backend escuche en 0.0.0.0 en lugar de localhost
ENV PORT=5000
ENV NODE_ENV=production

# Comando para iniciar la aplicación
# Usar "start" del package.json
CMD ["npm", "start"]
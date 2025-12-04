# Stage 1: Build (instalación de dependencias)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifest y prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias
RUN npm install && npm cache clean --force

# Copiar todo el código fuente
COPY . .

# No hay build step, así que omitimos npm run build

# Stage 2: Producción
FROM node:20-alpine

WORKDIR /app

# Copiar manifest y prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm install --only=production && npm cache clean --force

# Copiar código fuente directamente desde builder
COPY --from=builder /app .

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production

EXPOSE 3000

# Prisma generate y arranque del servidor
CMD npx prisma generate && node index.js

# --- Etapa 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar herramientas de compilación para dependencias nativas
RUN apk add --no-cache python3 make g++

# 1. Copiar package.json y package-lock.json
COPY package*.json ./

# 2. ¡CRUCIAL! Copiar la carpeta prisma ANTES de instalar
# Esto evita que el script 'postinstall' falle al no encontrar el schema
COPY prisma ./prisma/

# 3. Instalar TODAS las dependencias (incluyendo devDependencies para generar el cliente)
RUN npm ci

# 4. Copiar el resto del código fuente
COPY . .

# 5. Generar el cliente de Prisma explícitamente
# (Es vital hacerlo antes de borrar las devDependencies)
RUN npx prisma generate

# 6. Eliminar dependencias de desarrollo para aligerar la imagen
# OJO: Esto mantiene la carpeta 'prisma' y el cliente generado en node_modules
RUN npm prune --production

# --- Etapa 2: Imagen de Producción ---
FROM node:20-alpine

WORKDIR /app

# 1. Instalar dependencias del sistema necesarias para Prisma en Alpine
# Prisma necesita openssl y libc6-compat para funcionar en Alpine
RUN apk add --no-cache openssl libc6-compat

# 2. Copiar todo el directorio de trabajo desde el builder
# Como ya hicimos 'npm prune' en el builder, aquí solo viajan las deps de producción
COPY --from=builder /app ./

# 3. Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck (Verifica que tu app responda en /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Usar 'npm start' es más seguro que 'node index.js' porque maneja las señales de Docker
CMD ["npm", "run", "start"]
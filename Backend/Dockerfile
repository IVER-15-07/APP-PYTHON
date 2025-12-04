# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifest
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (NO ejecutar prisma generate aquí)
RUN npm install && npm cache clean --force

# Copiar código fuente
COPY . .

# Build (si usas JS no hace nada, pero es seguro)
RUN npm run build || echo "No build step"


# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm install --only=production && npm cache clean --force

# Copiar build
COPY --from=builder /app/dist ./dist

# Copiar código si usas JS sin dist
COPY --from=builder /app/src ./src

# Usuario seguro
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production

EXPOSE 3000

# Prisma generate se ejecuta aquí (runtime, con ENV ya cargadas)
CMD npx prisma generate && node index.js


FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copiar manifest
COPY package*.json ./

# Instalar TODAS las dependencias (incluye prisma, babel, etc.)
RUN npm install

# Copiar prisma y generar cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar todo el código
COPY . .

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000


# IMPORTANTE: tu proyecto arranca con index.js en raíz
CMD ["node", "index.js"]

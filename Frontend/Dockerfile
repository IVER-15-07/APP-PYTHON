# ============================================
# ETAPA 1: BUILD - Construir la aplicación React
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies necesarias para build)
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
# Esto genera carpeta 'dist' con archivos estáticos optimizados
RUN npm run build

# ============================================
# ETAPA 2: RUNTIME - Servir la aplicación
# ============================================
# Usar Nginx para servir archivos estáticos de forma eficiente
FROM nginx:alpine

# Copiar archivos compilados de la etapa anterior al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 3000

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
# --- Etapa 1: Construcción (Builder) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# ¡ESTO ES LO QUE TE FALTABA!
# Ejecutamos el build para crear la carpeta /dist
RUN npm run build

# --- Etapa 2: Servidor Nginx (Producción) ---
FROM nginx:alpine

# Copiamos el resultado del build anterior a la carpeta de Nginx
# NOTA: Si usas Create-React-App, cambia '/app/dist' por '/app/build'
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos una configuración básica de Nginx (opcional, pero recomendada para SPA)
# Si no tienes este archivo, crea uno simple o borra esta línea, 
# pero si usas React Router, necesitarás configurar Nginx para redirigir todo a index.html.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway asigna un puerto dinámico. Nginx por defecto usa el 80.
# Necesitamos un pequeño truco para que Nginx escuche en el puerto de Railway ($PORT)
# Reemplazamos la configuración por defecto para leer la variable PORT
COPY --from=builder /app/dist /usr/share/nginx/html
CMD sed -i -e 's/80/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
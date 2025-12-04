# Stage: build
FROM node:20-alpine AS builder
WORKDIR /app
ENV CI=true

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage: production with nginx
FROM nginx:alpine
# Remove default static files if any
RUN rm -rf /usr/share/nginx/html/*

# Copy build output (Vite default -> dist)
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: copy custom nginx.conf if you have one for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
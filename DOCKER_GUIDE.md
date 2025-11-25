# 🐳 Guía Completa de Docker - APP-PYTHON

## ¿Qué es Docker?

Docker es una herramienta que **empaqueta tu aplicación** con todas sus dependencias en un contenedor. Piénsalo como una "caja" con todo lo necesario para que tu app funcione, sin importar en qué máquina se ejecute.

### Conceptos clave:
- **Dockerfile**: Es como una "receta" que define cómo construir la imagen
- **Imagen Docker**: Es el resultado de seguir la receta (como un molde)
- **Contenedor**: Es la aplicación ejecutándose (como un molde usado para hacer un pastel)
- **Docker Compose**: Orquesta múltiples contenedores (Backend + Frontend) para que trabajen juntos

---

## 📋 Prerequisitos

✅ Tienes Docker Desktop instalado
✅ Tu Backend usa Node.js (Express.js)
✅ Tu Frontend usa React + Vite

---

## 🚀 PASO A PASO

### PASO 1: Entender la estructura del proyecto

```
APP-PYTHON/
├── Backend/
│   ├── package.json       ← Define dependencias
│   ├── index.js           ← Punto de entrada del servidor
│   ├── Dockerfile         ← Instrucciones para construir imagen
│   ├── .dockerignore      ← Archivos a ignorar
│   ├── .env               ← Variables de entorno
│   └── src/
│
├── Frontend/
│   ├── package.json       ← Define dependencias
│   ├── vite.config.js     ← Configuración de Vite
│   ├── Dockerfile         ← Instrucciones para construir imagen
│   ├── .dockerignore      ← Archivos a ignorar
│   ├── .env               ← Variables de entorno
│   └── src/
│
├── docker-compose.yml     ← Orquesta Backend y Frontend juntos
└── .env                   ← Variables de entorno globales
```

---

### PASO 2: Archivos necesarios

#### 📄 Backend Dockerfile
**¿Por qué cada instrucción?**
- `FROM node:18-alpine` → Usa imagen Node.js pequeña (alpine)
- `WORKDIR` → Crea carpeta de trabajo dentro del contenedor
- `COPY package*.json` → Copia dependencias
- `RUN npm install` → Instala dependencias
- `COPY .` → Copia código fuente
- `EXPOSE 5000` → Expone puerto (documentación, no abre realmente)
- `CMD` → Comando a ejecutar cuando inicie el contenedor

#### 📄 Frontend Dockerfile
**Usa 2 etapas (Multi-stage build):**
1. **Build stage**: Compila React con Vite → genera archivos estáticos
2. **Runtime stage**: Sirve archivos con Nginx (servidor optimizado para producción)

#### 📄 docker-compose.yml
**Conecta servicios:**
- Define Backend y Frontend como servicios
- Mapea puertos (host:contenedor)
- Variables de entorno
- Orden de inicio (depends_on)
- Red interna para comunicación

---

### PASO 3: Variables de Entorno

**Backend (.env):**
```
PORT=5000
DATABASE_URL="postgresql://..."
NODE_ENV=production
```

**Frontend (.env):**
```
VITE_API_URL=http://backend:5000
```

---

## 🔧 Comandos útiles

### Construir y ejecutar
```bash
# Construir imágenes
docker-compose build

# Ejecutar contenedores
docker-compose up

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener contenedores
docker-compose down

# Recrear todo
docker-compose up --build
```

### Ver estado
```bash
# Listar contenedores activos
docker ps

# Listar todas las imágenes
docker images

# Ver uso de recursos
docker stats
```

---

## ⚠️ Errores comunes y soluciones

### ❌ "Cannot find module"
**Causa**: npm install no se ejecutó correctamente
**Solución**: `docker-compose build --no-cache`

### ❌ "Port already in use"
**Causa**: Puerto 3000 o 5000 ya está en uso
**Solución**: Cambiar en docker-compose.yml: `"3001:3000"`

### ❌ "Can't connect to backend"
**Causa**: Frontend usa URL incorrecta
**Solución**: Asegúrate que VITE_API_URL=http://backend:5000

### ❌ "Connection refused"
**Causa**: Backend no está listo antes de que Frontend se conecte
**Solución**: Docker Compose espera, pero Backend puede tardar en iniciar

---

## 📊 Flujo de ejecución

```
docker-compose up
    ↓
Docker construye imagen Backend
    ↓
Docker construye imagen Frontend
    ↓
Inicia contenedor Backend (puerto 5000)
    ↓
Inicia contenedor Frontend (puerto 3000)
    ↓
Frontend accede a Backend vía http://backend:5000
    ↓
✅ Todo funciona!
```

---

## 🎯 Próximos pasos

1. ✅ Revisar que Backend escuche en `0.0.0.0` (no localhost)
2. ✅ Revisar que Frontend tenga variables de entorno correctas
3. ✅ Crear .dockerignore para optimizar
4. ✅ Hacer `docker-compose up --build`
5. ✅ Acceder a http://localhost:3000

---

## 📚 Recursos

- [Documentación Docker](https://docs.docker.com/)
- [Documentación Docker Compose](https://docs.docker.com/compose/)
- [Best practices Node.js](https://docs.docker.com/language/nodejs/build-images/)

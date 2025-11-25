# 🚀 INSTRUCCIONES DE EJECUCIÓN PASO A PASO

## ⚠️ IMPORTANTE: ANTES DE EMPEZAR

Asegúrate de tener:
- ✅ Docker Desktop instalado y ejecutándose
- ✅ Puerto 3000 y 5000 disponibles
- ✅ Variables de entorno configuradas

---

## 📋 PASO 1: Preparar variables de entorno

### 1.1 Crear archivo `.env` en la raíz del proyecto

```bash
# Desde la carpeta APP-PYTHON
cd /home/ubu2711/Documentos/Generacion_software/APP-PYTHON

# Copiar el ejemplo
cp .env.example .env
```

### 1.2 Editar `.env` con tus valores reales

```bash
# Abre .env con tu editor favorito y completa:
DATABASE_URL="tu_url_de_base_datos"
VITE_API_URL=http://backend:5000
```

---

## 📋 PASO 2: Verificar Backend

### 2.1 Revisar que Backend escuche en el puerto correcto

**Archivo**: `Backend/index.js`

Debe incluir:
```javascript
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
});
```

### 2.2 Verificar que Backend no use `localhost`

**Importante**: En Docker, el Backend debe escuchar en `0.0.0.0` (no `localhost`)

Busca en `Backend/src/app.js` o similar:
```javascript
app.listen(process.env.PORT || 3000, '0.0.0.0', () => { ... })
// ✅ Correcto: escucha en 0.0.0.0

app.listen(process.env.PORT || 3000, 'localhost', () => { ... })
// ❌ Incorrecto: solo escucha localmente
```

---

## 📋 PASO 3: Verificar Frontend

### 3.1 Revisar variables de entorno del Frontend

**Archivo**: `Frontend/src/main.jsx` o donde hagas requests

Debe usar:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 3.2 Actualizar llamadas al API

En lugar de:
```javascript
// ❌ Incorrecto (hardcodeado)
axios.get('http://localhost:5000/api/...')
```

Usa:
```javascript
// ✅ Correcto (variable de entorno)
axios.get(`${import.meta.env.VITE_API_URL}/api/...`)
```

---

## 🐳 PASO 4: Ejecutar con Docker

### 4.1 Ir a la carpeta raíz del proyecto

```bash
cd /home/ubu2711/Documentos/Generacion_software/APP-PYTHON
```

### 4.2 Construir las imágenes

```bash
# Construir imágenes de Backend y Frontend
docker-compose build

# O si quieres construir sin caché (recomendado si hay problemas)
docker-compose build --no-cache
```

**¿Qué pasa?**
- Docker lee `Backend/Dockerfile` y crea imagen del Backend
- Docker lee `Frontend/Dockerfile` y crea imagen del Frontend
- Descarga dependencias (npm packages)
- Compila Frontend con Vite

### 4.3 Iniciar contenedores

```bash
# Opción 1: Ver logs en tiempo real
docker-compose up

# Opción 2: Ejecutar en segundo plano
docker-compose up -d

# Opción 3: Recrear y ejecutar (si hay cambios)
docker-compose up --build
```

**¿Qué pasa?**
1. Docker inicia el Backend en puerto 5000
2. Docker inicia el Frontend en puerto 3000
3. Frontend y Backend pueden comunicarse por `http://backend:5000`

### 4.4 Ver que todo funcione

Abre en tu navegador:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📊 MONITOREO Y DEBUGGING

### Ver logs del Backend
```bash
docker-compose logs -f backend
```

### Ver logs del Frontend
```bash
docker-compose logs -f frontend
```

### Ver todos los logs
```bash
docker-compose logs -f
```

### Acceder a contenedor en vivo
```bash
# Acceder a terminal del Backend
docker exec -it app-backend sh

# Acceder a terminal del Frontend
docker exec -it app-frontend sh
```

### Ver contenedores en ejecución
```bash
docker ps
```

### Ver imágenes construidas
```bash
docker images
```

---

## ⚠️ SOLUCIÓN DE ERRORES COMUNES

### Error: "Port 3000 is already in use"

**Solución 1**: Cambiar puerto en `docker-compose.yml`
```yaml
frontend:
  ports:
    - "3001:3000"  # Usa 3001 en lugar de 3000
```

**Solución 2**: Matar proceso usando el puerto
```bash
# Encontrar qué proceso usa el puerto
lsof -i :3000

# Matar el proceso
kill -9 <PID>
```

### Error: "Cannot find module 'express'"

**Causa**: npm install no se ejecutó correctamente
**Solución**:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Error: "Frontend no puede conectar con Backend"

**Verificar**:
1. Backend está ejecutándose: `docker ps` debe mostrar `app-backend`
2. URL correcta en Frontend: `VITE_API_URL=http://backend:5000`
3. Backend escucha en `0.0.0.0:5000`

### Error: "Database connection refused"

**Verificar**:
1. DATABASE_URL es correcta en `.env`
2. Base de datos es accesible desde tu red
3. Prisma está ejecutado: `npx prisma generate`

---

## 🛑 DETENER CONTENEDORES

```bash
# Detener pero conservar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

---

## ✅ CHECKLIST FINAL

- [ ] Docker Desktop en ejecución
- [ ] `.env` configurado con variables reales
- [ ] Backend escucha en `0.0.0.0:5000`
- [ ] Frontend usa `VITE_API_URL` de entorno
- [ ] `docker-compose build` sin errores
- [ ] `docker-compose up` sin errores
- [ ] http://localhost:3000 muestra Frontend
- [ ] http://localhost:5000 responde del Backend
- [ ] Frontend puede llamar al Backend

---

## 📞 SOPORTE

Si hay problemas:

1. Revisa los logs: `docker-compose logs`
2. Reconstruye sin caché: `docker-compose build --no-cache`
3. Verifica que no hay procesos conflictivos: `docker ps`
4. Limpia todo y reinicia: `docker-compose down -v && docker-compose up --build`

¡Deberías estar listo! 🎉

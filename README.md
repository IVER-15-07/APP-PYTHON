# PyLearn

***

## 📋 Tabla de Contenidos

- [Información del Proyecto](#información-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Atributos de Calidad](#atributos-de-calidad)
- [Arquitectura](#arquitectura)
- [Modelo de Datos](#modelo-de-datos)
- [CI/CD](#cicd)
- [Instalación y Ejecución](#instalación-y-ejecución)

## 🔗 Información del Proyecto

- **Repositorio**: [https://github.com/IVER-15-07/APP-PYTHON](https://github.com/IVER-15-07/APP-PYTHON)
- **Aplicación en Producción**: [PyLearn en Railway](https://frontend-production-b291.up.railway.app/)
- **Rama Principal**: `main`
- **Rama de Desarrollo**: `develop`

## 🚀 Stack Tecnológico

### Frontend
- **React** 19.1.1 - Biblioteca para interfaces de usuario
- **Vite** 7.1.2 - Build tool y dev server
- **React Router** v7.9.2 - Navegación y enrutamiento
- **Tailwind CSS** 4.1.13 - Framework de estilos utility-first
- **Lucide React** - Biblioteca de iconos
- **Socket.IO Client** - Comunicación en tiempo real

### Backend
- **Node.js** 20 - Entorno de ejecución
- **Express.js** - Framework web
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash de contraseñas
- **Nodemailer** - Envío de correos electrónicos
- **Cloudinary** - Almacenamiento de archivos
- **Socket.IO** - WebSockets para tiempo real

### DevOps & Herramientas
- **GitHub Actions** - CI/CD pipelines
- **Railway** - Plataforma de deployment
- **Docker** - Contenedorización
- **ESLint** - Linter para JavaScript
- **Jest** - Framework de testing
- **Prettier** - Formateador de código

## 🎯 Atributos de Calidad

### 1. Accesibilidad ⭐ (Principal)
**Objetivo**: El sistema debe ser fácil de usar por cualquier estudiante, sin importar su experiencia previa en programación o nivel técnico.

**Implementación**:
- Interfaz clara y navegación intuitiva
- Uso de colores contrastantes y diseño responsivo
- Subtítulos en videos educativos

**Importancia**: Permite que el laboratorio llegue a más usuarios y reduce la curva de aprendizaje.

### 2. Seguridad e Integridad de Datos ⭐ (Principal)
**Objetivo**: Los progresos de los estudiantes (notas, ejercicios, exámenes) deben almacenarse de manera segura y confiable.

**Implementación**:
- Autenticación JWT con tokens de acceso
- Verificación de email mediante OTP (código de 6 dígitos)
- Autorización basada en roles (Admin, Profesor, Estudiante)
- Hash de contraseñas con bcrypt
- Validación de datos en backend y frontend
- Protección de rutas privadas
- CORS configurado para seguridad de API

**Importancia**: Protege la información de los estudiantes y garantiza la consistencia de los datos académicos.

### 3. Confiabilidad y Disponibilidad ⭐ (Principal)
**Objetivo**: El sistema debe estar disponible cuando los estudiantes lo necesiten y funcionar de manera predecible.

**Implementación**:
- Manejo robusto de excepciones con middleware de errores
- Testing automatizado con Jest (unitarias e integración)
- CI/CD con GitHub Actions (4 workflows)
- Deployment automático en Railway
- Monitoreo de logs y errores
- Arquitectura en capas para mejor mantenibilidad

**Importancia**: Asegura una experiencia de aprendizaje continua sin interrupciones.

### 4. Usabilidad e Interactividad
**Objetivo**: Los estudiantes deben poder interactuar directamente con el contenido y recibir retroalimentación inmediata.

**Implementación**:
- Navegación intuitiva con React Router
- Sistema de grupos y cursos organizados por niveles
- Exploración de tópicos con filtros
- Gestión de archivos multimedia (PDFs, videos, imágenes)
- Sistema de evaluaciones con respuesta inmediata
- Interfaz responsive con Tailwind CSS
- Comunicación en tiempo real con Socket.IO

**Importancia**: Mantiene la motivación y asegura que el aprendizaje sea práctico, no solo teórico.

### 5. Portabilidad
**Objetivo**: El software debe poder usarse en diferentes dispositivos (PC, laptop, tablet, móvil).

**Implementación**:
- Aplicación web SPA (Single Page Application) con React
- Diseño responsive mobile-first con Tailwind CSS
- API REST documentada para integraciones
- Compatibilidad cross-browser
- Deployment cloud-native en Railway

**Importancia**: Los estudiantes pueden aprender en cualquier momento y lugar.

### 6. Escalabilidad y Mantenibilidad
**Objetivo**: El sistema debe crecer fácilmente sin necesidad de rehacer la plataforma desde cero.

**Implementación**:
- Arquitectura en capas (Controller → Service → Repository)
- Patrón Repository para abstracción de datos
- Módulos independientes por funcionalidad
- Base de datos normalizada con Prisma ORM
- Migraciones versionadas para cambios de esquema
- Servicios desacoplados (Frontend/Backend separados)
- Código modular y reutilizable

**Importancia**: Asegura la continuidad del proyecto a largo plazo y facilita la incorporación de nuevas funcionalidades.
## 🏗️ Arquitectura

### Modelo C4

#### Nivel 1: Diagrama de Contexto
![Modelo C4 - Context](https://github.com/user-attachments/assets/b1d09a00-a31a-4338-98ed-963cf6aa53a9)

*PyLearn es una plataforma web interactiva para el aprendizaje de programación en Python. 
Permite a estudiantes y docentes acceder a contenido educativo, realizar prácticas con un editor de código integrado, y gestionar evaluaciones. 
El sistema se integra con servicios de email, gestión académica y kardex estudiantil para proporcionar una experiencia de aprendizaje completa.*

#### Nivel 2: Diagrama de Contenedores
![Modelo C4](https://github.com/user-attachments/assets/bbb85325-595f-42a8-9eb5-febda1429834)

*El sistema está compuesto por tres contenedores principales: un **Frontend** (React + Vite + Tailwind) 
que proporciona la interfaz de usuario como SPA, un **Backend** (Node.js + Express) que expone una API REST para gestionar contenido educativo, 
autenticación y evaluaciones, y una **Base de Datos** (PostgreSQL con Prisma) que almacena usuarios, cursos, grupos, tópicos y resultados. 
Adicionalmente, se integra con **Cloudinary** para almacenamiento de archivos multimedia.*

## 📊 Modelo de Datos

### Diagrama Entidad-Relación

<img width="3000" height="1824" alt="Database ER diagram (crow's foot)" src="https://github.com/user-attachments/assets/c6c37973-0b71-4d0f-be76-0b5504bad4ac" />

## 🔄 CI/CD

El proyecto implementa pipelines de integración y despliegue continuo mediante GitHub Actions:

### Workflows de Integración Continua (CI)

1. **main.yml** - CI para rama `main`
   - Validación de código con ESLint
   - Ejecución de tests con Jest
   - Build de frontend y backend en paralelo

2. **develop.yml** - CI para rama `develop`
   - Mismas validaciones que main.yml
   - Se ejecuta en cada push a develop

3. **blank.yml** - CI para ramas `fix/*` y `test/*`
   - Validación simplificada (solo backend)
   - Lint y tests rápidos

### Workflow de Despliegue Continuo (CD)

4. **deploy-railway.yml** - Deployment automático
   - Se activa al hacer push a `main`
   - Despliega automáticamente a Railway
   - Servicios: Frontend y Backend separados

### Métricas Controladas
- Tiempo de ejecución del pipeline
- Tasa de éxito/fallo de builds
- Cantidad de tests ejecutados
- Cobertura de código (cuando aplica)

## 🛠️ Instalación y Ejecución

### Requisitos Previos
- Node.js 20 o superior
- PostgreSQL 14 o superior
- npm o yarn

### Backend

```bash
cd Backend
npm install
cp .env.example .env  # Configurar variables de entorno
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env  # Configurar API URL
npm run dev
```

### Docker (Opcional)

```bash
docker-compose up -d
```

## 📝 Variables de Entorno

### Backend
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pysondb
JWT_SECRET=your-secret-key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend
```env
VITE_API_URL=http://localhost:3000/api
```

## 👥 Contribución

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es parte de un proyecto académico.




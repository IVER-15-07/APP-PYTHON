# PysonEdu

***

## 📋 Tabla de Contenidos

- [Atributos de Calidad](#atributos-de-calidad)
- [Arquitectura](#arquitectura)
- [Modelo de Datos](#modelo-de-datos)

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
- Autenticación y autorización de usuarios
- Validación de datos en backend y frontend
- Backups automáticos programados
- Transacciones ACID para operaciones críticas

**Importancia**: Protege la información de los estudiantes y garantiza la consistencia de los datos académicos.

### 3. Confiabilidad y Disponibilidad ⭐ (Principal)
**Objetivo**: El sistema debe estar disponible cuando los estudiantes lo necesiten y funcionar de manera predecible.

**Implementación**:
- Manejo robusto de excepciones
- Logging completo de operaciones
- Pruebas automatizadas (unitarias e integración)
- Monitoreo de uptime y performance
- Sistema de caché para contenido frecuente

**Importancia**: Asegura una experiencia de aprendizaje continua sin interrupciones.

### 4. Usabilidad e Interactividad
**Objetivo**: Los estudiantes deben poder interactuar directamente con el contenido y recibir retroalimentación inmediata.

**Implementación**:
- Editor de código en línea integrado
- Ejercicios con corrección automática
- Quizzes interactivos con feedback instantáneo
- Gamificación (badges, progreso visual)

**Importancia**: Mantiene la motivación y asegura que el aprendizaje sea práctico, no solo teórico.

### 5. Portabilidad
**Objetivo**: El software debe poder usarse en diferentes dispositivos (PC, laptop, tablet, móvil).

**Implementación**:
- Diseño web responsivo (mobile-first)
- Compatibilidad cross-browser
- PWA (Progressive Web App) para uso offline
- API REST para futuras apps nativas

**Importancia**: Los estudiantes pueden aprender en cualquier momento y lugar.

### 6. Escalabilidad y Mantenibilidad
**Objetivo**: El sistema debe crecer fácilmente sin necesidad de rehacer la plataforma desde cero.

**Implementación**:
- Arquitectura modular (separación de capas)
- Base de datos normalizada y bien estructurada
- Sistema de gestión de contenidos (CMS) para módulos
- Versionado de API

**Importancia**: Asegura la continuidad del proyecto a largo plazo y facilita la incorporación de nuevas funcionalidades.
## 🏗️ Arquitectura

### Modelo C4

#### Nivel 1: Diagrama de Contexto
![Modelo C4 - Context](https://github.com/user-attachments/assets/b1d09a00-a31a-4338-98ed-963cf6aa53a9)

*PysonEdu es una plataforma web interactiva para el aprendizaje de programación en Python. 
Permite a estudiantes y docentes acceder a contenido educativo, realizar prácticas con un editor de código integrado, y gestionar evaluaciones. 
El sistema se integra con servicios de email, gestión académica y kardex estudiantil para proporcionar una experiencia de aprendizaje completa.*

#### Nivel 2: Diagrama de Contenedores
![Modelo C4](https://github.com/user-attachments/assets/bbb85325-595f-42a8-9eb5-febda1429834)

*El sistema está compuesto por tres contenedores principales: un **Frontend** (React + Tailwind) 
que proporciona la interfaz de usuario, un **Backend** (Node.js) que expone una API REST para gestionar el contenido educativo y laboratorios, 
y una **Base de Datos** (PostgreSQL) que almacena usuarios, cursos, evaluaciones y resultados. Adicionalmente, un **File System** externo gestiona el contenido multimedia (videos, imágenes, textos).*


## 📊 Modelo de Datos

### Diagrama Entidad-Relación

<img width="3000" height="1824" alt="Database ER diagram (crow's foot)" src="https://github.com/user-attachments/assets/c6c37973-0b71-4d0f-be76-0b5504bad4ac" />




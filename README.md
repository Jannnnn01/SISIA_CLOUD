# SISIA Cloud

Sistema Seguro de Gestión de Incidentes y Activos Académicos para la asignatura Seguridad de los Sistemas de Información.

## Descripción

SISIA Cloud es una aplicación web con autenticación segura, roles, gestión de usuarios, incidentes, activos, riesgos, controles, perfil de usuario y auditoría. Está preparada para desplegarse en Render con HTTPS y PostgreSQL cloud.

## Tecnologías

- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios, React Router.
- Backend: Node.js, Express, TypeScript, Sequelize, PostgreSQL, JWT, bcrypt, cors, dotenv.
- Base de datos: PostgreSQL cloud mediante `DATABASE_URL`.
- Hosting objetivo: Render.

## Arquitectura

```text
sisia-cloud/
  backend/
  frontend/
  docs/
  README.md
  .gitignore
```

El backend expone una API REST bajo `/api`. El frontend consume esa API usando `VITE_API_URL`. Las credenciales, secretos, URLs y configuración por entorno se manejan en archivos `.env`, no versionados.

## Roles

- Administrador: acceso total, usuarios, incidentes, activos, riesgos, controles y auditoría.
- Analista de Seguridad: gestiona incidentes, activos, riesgos y controles.
- Usuario: crea incidentes, consulta sus propios incidentes y actualiza su perfil.

## Seguridad implementada

- Hash de contraseñas con bcrypt.
- JWT con expiración configurable.
- Middleware de autenticación.
- Middleware de autorización por roles.
- CORS configurado con `FRONTEND_URL`.
- Validaciones básicas en backend.
- No se devuelve `password` en respuestas.
- Manejo de errores sin exponer detalles técnicos.
- Auditoría básica para login, registro, creación de usuario, creación de incidente y cambio de estado de incidente.
- Edición de perfil y cambio de contraseña con validación de contraseña actual.
- Auditoría para edición de perfil, cambio de contraseña y cierre de sesión.
- Eliminación lógica mediante `status`.
- Sequelize para reducir riesgo de SQL Injection.

## Variables de entorno

Backend: copiar `backend/.env.example` a `backend/.env`.

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://usuario:password:host:5432/base
JWT_SECRET=definir_un_secreto_seguro_fuera_del_codigo
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=10
```

Frontend: copiar `frontend/.env.example` a `frontend/.env`.

```env
VITE_API_URL=http://localhost:4000/api
```

## Instalación local

Backend:

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Comandos

Backend:

```bash
npm run dev
npm run build
npm start
npm run db:migrate
npm run db:seed
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## PostgreSQL cloud

Crear una base PostgreSQL en Render PostgreSQL, Railway o Supabase. Copiar la cadena de conexión en `DATABASE_URL`. El backend usa únicamente esa variable para conectarse.

## Despliegue en Render

El repositorio incluye `render.yaml` como referencia para Blueprint, pero también puede configurarse manualmente desde el panel de Render.

### Backend como Web Service

1. Crear un nuevo **Web Service** en Render conectado al repositorio de GitHub.
2. Configurar:
   - Root directory: `backend`
   - Runtime: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. Agregar variables de entorno:

```env
PORT=4000
NODE_ENV=production
DATABASE_URL=URL_REAL_DE_NEON
JWT_SECRET=CLAVE_SEGURA_DE_PRODUCCION_MINIMO_32_CARACTERES
JWT_EXPIRES_IN=1d
FRONTEND_URL=https://URL_DEL_FRONTEND_RENDER
BCRYPT_SALT_ROUNDS=10
```

El backend usa `process.env.PORT`, conecta PostgreSQL únicamente por `DATABASE_URL`, restringe CORS a `FRONTEND_URL` y no debe depender de `localhost` en producción.

### Frontend como Static Site

1. Crear un nuevo **Static Site** en Render conectado al mismo repositorio.
2. Configurar:
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
3. Agregar variable de entorno:

```env
VITE_API_URL=https://URL_DEL_BACKEND_RENDER/api
```

Para React Router, configurar una regla de rewrite:

```text
source: /*
destination: /index.html
type: rewrite
```

Esta regla permite que rutas internas como `/dashboard`, `/assets` o `/profile` funcionen al recargar la página.

### Conexión con Neon PostgreSQL

1. Crear o usar una base PostgreSQL en Neon.
2. Copiar la cadena de conexión SSL.
3. Pegarla en `DATABASE_URL` del backend en Render.
4. Ejecutar en Render Shell o localmente apuntando a esa base:

Después del despliegue, ejecutar una vez en backend:

```bash
npm run db:migrate
npm run db:seed
```

### Pruebas posteriores al despliegue

- Abrir el frontend público por HTTPS.
- Confirmar que `https://URL_DEL_BACKEND_RENDER/api/health` responde.
- Iniciar sesión con el usuario administrador de prueba.
- Ver dashboard.
- Crear incidente.
- Crear activo.
- Crear riesgo.
- Crear control.
- Ver auditoría.
- Editar perfil.
- Cerrar sesión.
- Confirmar que frontend y backend usan HTTPS.
- Confirmar que Neon está conectado.

### Seguridad en producción

- No subir archivos `.env` a GitHub.
- Usar `JWT_SECRET` fuerte, privado y de mínimo 32 caracteres.
- Render sirve por HTTPS.
- Neon usa conexión PostgreSQL con SSL.
- `FRONTEND_URL` debe ser exactamente la URL pública del frontend para que CORS no acepte orígenes no autorizados.



Este usuario es solo para ambiente académico o demostración. En producción debe cambiarse la contraseña inmediatamente.

## Defensa académica

El proyecto demuestra una arquitectura separada frontend/backend, uso de variables de entorno, autenticación JWT, contraseñas hasheadas, perfil seguro, control de acceso por roles, auditoría de acciones relevantes, conexión segura a base de datos cloud y preparación para HTTPS mediante Render.

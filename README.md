# SISIA Cloud

Sistema Seguro de Gestión de Incidentes y Activos Académicos para la asignatura Seguridad de los Sistemas de Información.

## Descripción

SISIA Cloud es una aplicación web con autenticación segura, roles, gestión inicial de usuarios e incidentes, auditoría básica y módulos base para activos, riesgos y controles. Está preparada para desplegarse en Render con HTTPS y PostgreSQL cloud.

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

Backend:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `BCRYPT_SALT_ROUNDS`, `NODE_ENV=production`

Frontend:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Variable: `VITE_API_URL=https://url-del-backend/api`

Después del despliegue, ejecutar una vez en backend:

```bash
npm run db:migrate
npm run db:seed
```

## Usuario administrador de prueba

- Email: `admin@sisia.com`
- Password: `Admin12345*`

Este usuario es solo para ambiente académico o demostración. En producción debe cambiarse la contraseña inmediatamente.

## Defensa académica

El proyecto demuestra una arquitectura separada frontend/backend, uso de variables de entorno, autenticación JWT, contraseñas hasheadas, control de acceso por roles, auditoría de acciones relevantes, conexión segura a base de datos cloud y preparación para HTTPS mediante Render.

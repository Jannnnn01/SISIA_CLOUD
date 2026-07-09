# SISIA Cloud

Sistema Seguro de Gestión de Incidentes y Activos Académicos para la asignatura Seguridad de los Sistemas de Información.

## Descripción

SISIA Cloud es una aplicación web con autenticación segura, roles, usuarios, incidentes, activos, riesgos, controles, perfil de usuario y auditoría. Está preparada para desplegarse en Render con frontend estático, backend Node.js y PostgreSQL cloud en Neon.

## Tecnologías

- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios y React Router.
- Backend: Node.js, Express, TypeScript, Sequelize, PostgreSQL, JWT, bcrypt, Helmet, CORS y rate limiting.
- Base de datos: PostgreSQL mediante `DATABASE_URL`.
- Hosting objetivo: Render.

## Estructura

```text
sisia-cloud/
  backend/
  frontend/
  docs/
  render.yaml
  README.md
```

El backend expone una API REST bajo `/api`. El frontend consume esa API usando `VITE_API_URL`. Las credenciales, secretos y URLs se configuran por variables de entorno y no deben subirse al repositorio.

## Roles

- Administrador: acceso total a usuarios, incidentes, activos, riesgos, controles y auditoría.
- Analista de Seguridad: gestión operativa de incidentes, activos, riesgos y controles.
- Usuario: crea incidentes, consulta sus propios incidentes y actualiza su perfil.

## Seguridad Implementada

- Contraseñas hasheadas con bcrypt.
- Política de contraseña: mínimo 10 caracteres, máximo 128, mayúscula, minúscula, número, carácter especial y sin espacios.
- JWT con expiración y `tokenVersion` para revocar sesiones.
- El backend no confía en el rol incluido en el token: consulta usuario y rol actuales en PostgreSQL.
- Usuarios inactivos no pueden iniciar sesión ni seguir usando tokens antiguos.
- Helmet para cabeceras HTTP de seguridad.
- Rate limiting para login y registro.
- CORS restringido por `ALLOWED_ORIGINS` o `FRONTEND_URL`; no se permite `*`.
- No se devuelve `password` ni `tokenVersion` en respuestas públicas.
- Eliminación lógica mediante `status`; no se borran registros de negocio físicamente.
- Auditoría de login exitoso/fallido, registro, logout, revocación de sesión, cambios de contraseña, cambios de rol/estado y operaciones sobre incidentes, activos, riesgos y controles.
- Manejo de errores con mensajes funcionales, sin exponer trazas técnicas al usuario.

## Variables de Entorno

Backend: copiar `backend/.env.example` a `backend/.env`.

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://usuario:password@host:5432/base?sslmode=require
JWT_SECRET=definir_un_secreto_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
BCRYPT_SALT_ROUNDS=10
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin.temporal@example.com
ADMIN_PASSWORD=Cambiar_Esta_Clave_123*
LOGIN_RATE_LIMIT_WINDOW_MINUTES=15
LOGIN_RATE_LIMIT_MAX=5
REGISTER_RATE_LIMIT_WINDOW_MINUTES=60
REGISTER_RATE_LIMIT_MAX=10
TEST_DATABASE_URL=
```

Frontend: copiar `frontend/.env.example` a `frontend/.env`.

```env
VITE_API_URL=http://localhost:4000/api
```

## Instalación Local

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
npm run test:run
npm run db:migrate
npm run db:seed
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Usuario Administrador de Prueba

El usuario administrador se crea con `npm run db:seed` usando estas variables:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

No hay credenciales reales quemadas en el código. Para una defensa académica se puede usar un administrador temporal definido en `.env`, y cambiar o eliminar esa cuenta después de la demostración.

## PostgreSQL Cloud con Neon

1. Crear una base PostgreSQL en Neon.
2. Copiar la cadena de conexión con SSL.
3. Pegarla como `DATABASE_URL` en el backend.
4. Ejecutar migración y seed apuntando a esa base:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

## Despliegue en Render

El repositorio incluye `render.yaml` como referencia. También se puede configurar manualmente.

### Backend como Web Service

1. Crear un Web Service conectado al repositorio.
2. Configurar:
   - Root directory: `backend`
   - Runtime: Node
   - Build command: `npm install --include=dev && npm run build`
   - Start command: `npm start`
3. Agregar variables:

```env
PORT=4000
NODE_ENV=production
DATABASE_URL=URL_REAL_DE_NEON
JWT_SECRET=CLAVE_SEGURA_DE_PRODUCCION_MINIMO_32_CARACTERES
JWT_EXPIRES_IN=1d
FRONTEND_URL=https://URL_DEL_FRONTEND_RENDER
ALLOWED_ORIGINS=https://URL_DEL_FRONTEND_RENDER
BCRYPT_SALT_ROUNDS=10
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin.temporal@example.com
ADMIN_PASSWORD=Cambiar_Esta_Clave_123*
LOGIN_RATE_LIMIT_WINDOW_MINUTES=15
LOGIN_RATE_LIMIT_MAX=5
REGISTER_RATE_LIMIT_WINDOW_MINUTES=60
REGISTER_RATE_LIMIT_MAX=10
```

El backend usa `process.env.PORT`, conecta PostgreSQL solo por `DATABASE_URL`, restringe CORS y no depende de `localhost` en producción.

### Frontend como Static Site

1. Crear un Static Site conectado al repositorio.
2. Configurar:
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
3. Agregar variable:

```env
VITE_API_URL=https://URL_DEL_BACKEND_RENDER/api
```

Para React Router, configurar rewrite:

```text
source: /*
destination: /index.html
type: rewrite
```

## Pruebas Posteriores al Despliegue

- Abrir el frontend por HTTPS.
- Confirmar que `https://URL_DEL_BACKEND_RENDER/api/health` responde.
- Iniciar sesión con el administrador creado por seed.
- Ver dashboard.
- Crear incidente, activo, riesgo y control.
- Ver auditoría.
- Editar perfil.
- Cambiar contraseña y volver a iniciar sesión.
- Cerrar sesión.
- Confirmar que frontend y backend usan HTTPS.
- Confirmar que Neon está conectado.

## Notas de Seguridad

- No subir `.env` a GitHub.
- `JWT_SECRET` debe ser privado, fuerte y de mínimo 32 caracteres en producción.
- Render sirve por HTTPS.
- Neon usa PostgreSQL con SSL.
- `ALLOWED_ORIGINS` debe contener solo dominios confiables.
- El frontend guarda el token en `localStorage` para simplicidad académica. Como mejora futura para producción, se recomienda migrar a cookies `HttpOnly`, `Secure` y `SameSite`.

## Defensa Académica

El proyecto demuestra separación frontend/backend, variables de entorno, autenticación JWT, revocación de sesiones, contraseñas hasheadas, control de acceso por roles, auditoría, eliminación lógica, conexión segura a PostgreSQL cloud y despliegue preparado para HTTPS mediante Render.

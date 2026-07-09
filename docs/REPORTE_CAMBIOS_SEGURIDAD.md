# Reporte de Cambios de Seguridad - SISIA Cloud

## 1. Información general

- Nombre del proyecto: SISIA Cloud.
- Rama actual: `main`.
- Commit actual: `b7ba19a`.
- Fecha del informe: `2026-07-09 14:24:41 -05:00`.
- Objetivo de los cambios: endurecer autenticación, autorización, sesiones, auditoría, CORS, validaciones y preparación de despliegue sin cambiar la arquitectura base.
- Estado general de la implementación: implementado y compilable. Las pruebas automatizadas actuales pasan. Existen pendientes documentados en vulnerabilidades npm y mejoras de sesión.
- Tecnologías involucradas: Node.js, Express, TypeScript, Sequelize, PostgreSQL, JWT, bcrypt, Helmet, express-rate-limit, React, Vite, TypeScript, Tailwind, Axios, React Router, Render y Neon/PostgreSQL.

## 2. Resumen ejecutivo

Antes de los últimos cambios, el sistema tenía varios riesgos técnicos: credenciales administrativas de prueba en código, sesiones que no se invalidaban de forma centralizada, rol persistido dentro del JWT como posible fuente desactualizada, validaciones parciales, CORS limitado a una sola variable y auditoría incompleta para intentos fallidos o accesos rechazados.

Los cambios incorporaron una política centralizada de contraseñas, uso de variables `ADMIN_*` para el seed, validación del usuario y rol actual contra PostgreSQL en cada ruta protegida, campo `tokenVersion` para invalidar tokens previos, Helmet, rate limiting para login/registro, CORS con `ALLOWED_ORIGINS`, auditoría ampliada y validaciones de negocio en usuarios, incidentes, activos, riesgos y controles.

El sistema conserva su comportamiento general: API REST protegida, frontend React con rutas protegidas, tres roles principales, dashboard, gestión de usuarios, incidentes, activos, riesgos, controles, perfil y auditoría. Se reducen riesgos de fuerza bruta, exposición accidental de credenciales, sesiones persistentes después de logout/cambio de contraseña y decisiones de autorización basadas en datos desactualizados del token.

## 3. Archivos creados

| Archivo | Propósito | Módulo relacionado |
| --- | --- | --- |
| `backend/src/validations/password.validation.ts` | Centralizar la política de contraseña fuerte. | Autenticación, usuarios, seed |
| `backend/tests/auth.controller.test.ts` | Validar que login fallido audite sin persistir contraseña. | Pruebas backend |
| `backend/tests/auth.middleware.test.ts` | Validar token inválido, usuario inactivo, `tokenVersion` y rol actual de BD. | Pruebas backend |
| `backend/tests/incidents.controller.test.ts` | Validar restricciones de acceso y edición de incidentes. | Pruebas backend |
| `backend/tests/password.validation.test.ts` | Validar aceptación/rechazo de contraseñas según política. | Pruebas backend |
| `backend/tests/risk.service.test.ts` | Validar cálculo y clasificación de riesgo. | Pruebas backend |
| `frontend/src/api/session.ts` | Centralizar la clave de almacenamiento del token. | Sesión frontend |
| `docs/REPORTE_CAMBIOS_SEGURIDAD.md` | Documentar el estado final de cambios de seguridad. | Documentación |
| `docs/LISTA_ARCHIVOS_PROYECTO.md` | Documentar árbol relevante y propósito de archivos. | Documentación |

## 4. Archivos modificados

| Archivo | Cambios realizados | Motivo técnico |
| --- | --- | --- |
| `README.md` | Documentación de variables, seguridad, Render, Neon y pruebas. | Alinear documentación con implementación actual. |
| `backend/.env.example` | Agregadas variables de admin, CORS, rate limit y test DB. | Evitar secretos en código y preparar despliegue. |
| `backend/package.json` | Agregadas dependencias y scripts de pruebas. | Incorporar seguridad HTTP, rate limiting y pruebas. |
| `backend/package-lock.json` | Actualizado por instalación de dependencias. | Registrar versiones instaladas. |
| `backend/src/app.ts` | Helmet, `trust proxy`, CORS con `ALLOWED_ORIGINS` y rutas API. | Endurecimiento HTTP y despliegue en proxy. |
| `backend/src/config/env.ts` | Variables nuevas y validación de `JWT_SECRET`, `FRONTEND_URL` y CORS. | Configuración segura por entorno. |
| `backend/src/config/database.ts` | Conexión Sequelize por `DATABASE_URL`; SSL en producción. | Conexión a PostgreSQL/Neon. |
| `backend/src/controllers/auth.controller.ts` | Login/register, perfil, contraseña, logout, auditoría y revocación. | Seguridad de autenticación y sesiones. |
| `backend/src/controllers/users.controller.ts` | Validaciones, hash, cambios sensibles, `tokenVersion` y auditoría. | Gestión segura de usuarios. |
| `backend/src/controllers/incidents.controller.ts` | Estado `inactivo`, reglas por rol, restricciones y auditoría. | Consistencia de incidentes. |
| `backend/src/controllers/assets.controller.ts` | Validaciones de longitudes/enums y auditoría. | Gestión segura de activos. |
| `backend/src/controllers/risks.controller.ts` | Validaciones numéricas, relación con activo activo y auditoría. | Gestión de riesgos consistente. |
| `backend/src/controllers/controls.controller.ts` | Validaciones, relación con riesgo activo y auditoría. | Gestión de controles consistente. |
| `backend/src/controllers/dashboard.controller.ts` | Métricas reales por rol. | Dashboard operativo. |
| `backend/src/database/seed.ts` | Seed admin desde variables `ADMIN_*`; no modifica contraseña existente. | Eliminar credenciales quemadas. |
| `backend/src/middlewares/auth.middleware.ts` | Consulta usuario+rol actual, valida status y `tokenVersion`, audita rechazos. | No confiar en rol del JWT ni tokens revocados. |
| `backend/src/middlewares/role.middleware.ts` | Auditoría de accesos denegados por rol. | Trazabilidad de autorización. |
| `backend/src/services/audit.service.ts` | Auditoría no bloqueante con manejo de errores. | Evitar que fallas de auditoría rompan operaciones. |
| `backend/src/services/auth.service.ts` | Token con `tokenVersion`; respuesta pública sin password/tokenVersion. | Seguridad de sesión y datos sensibles. |
| `backend/src/services/risk.service.ts` | Cálculo de nivel de riesgo. | Automatizar clasificación. |
| `backend/src/utils/jwt.ts` | Payload JWT incluye `tokenVersion`. | Revocación de sesiones. |
| `backend/src/models/User.ts` | Columna `tokenVersion`; scopes para ocultar password/tokenVersion. | Modelo de sesión segura. |
| `backend/src/validations/auth.validation.ts` | Validación básica de email/password requerida para login. | Entrada controlada. |
| `backend/src/validations/incident.validation.ts` | Longitudes, prioridad y estado `inactivo`. | Reglas de incidentes. |
| `backend/src/validations/user.validation.ts` | Uso de política central de contraseña y longitudes. | Reglas de usuarios. |
| `backend/src/routes/auth.routes.ts` | Rate limit en login y registro. | Protección contra fuerza bruta. |
| `frontend/package-lock.json` | Actualización por instalación. | Consistencia de dependencias. |
| `frontend/src/api/axios.ts` | `VITE_API_URL`, interceptor de token y limpieza ante 401. | Manejo de sesión frontend. |
| `frontend/src/context/AuthContext.tsx` | Uso de clave centralizada, logout y expiración de sesión. | Estado global de autenticación. |
| `frontend/src/pages/LoginPage.tsx` | Campos vacíos; se quitaron credenciales precargadas. | Evitar credenciales en UI. |
| `frontend/src/pages/IncidentsPage.tsx` | Soporte UI para `inactivo` y ocultar acciones no permitidas. | Coherencia frontend/backend. |
| `docs/arquitectura.md` | Arquitectura y flujo de seguridad actualizado. | Documentación técnica. |
| `docs/controles-seguridad.md` | Controles implementados y limitaciones. | Documentación académica. |
| `docs/matriz-riesgos.md` | Matriz ampliada y alineada a controles. | Gestión de riesgos. |
| `render.yaml` | Variables, build/start y rewrite de frontend. | Preparación Render. |

## 5. Dependencias agregadas o actualizadas

| Dependencia | Versión | Backend o frontend | Finalidad |
| --- | --- | --- | --- |
| `helmet` | `^8.0.0` | Backend | Agregar cabeceras HTTP de seguridad. |
| `express-rate-limit` | `^7.5.1` | Backend | Limitar intentos de login y registro. |
| `vitest` | `^2.1.8` | Backend | Framework de pruebas automatizadas. |
| `supertest` | `^7.0.0` | Backend | Pruebas HTTP de middlewares/controladores Express. |
| `@types/supertest` | `^6.0.2` | Backend | Tipos TypeScript para pruebas con Supertest. |
| `axios` | `^1.7.9` | Frontend | Cliente HTTP usado por la API frontend. |
| `vite` | `^6.0.3` | Frontend | Build y servidor de desarrollo. |

## 6. Variables de entorno

| Variable | Obligatoria | Entorno | Finalidad | Valor de ejemplo seguro |
| --- | --- | --- | --- | --- |
| `PORT` | Sí en Render | Backend | Puerto del servicio. | `4000` |
| `NODE_ENV` | Sí | Backend | Modo de ejecución. | `production` |
| `DATABASE_URL` | Sí | Backend | Conexión PostgreSQL/Neon. | `postgresql://<usuario>:<clave>@<host>:5432/<base>?sslmode=require` |
| `JWT_SECRET` | Sí | Backend | Firma de JWT; mínimo 32 caracteres en producción. | `usar_secreto_largo_generado_fuera_del_codigo` |
| `JWT_EXPIRES_IN` | Sí | Backend | Duración del token. | `1d` |
| `FRONTEND_URL` | Sí | Backend | URL principal permitida del frontend. | `https://frontend.example.com` |
| `ALLOWED_ORIGINS` | Recomendado | Backend | Lista separada por comas para CORS. | `https://frontend.example.com` |
| `BCRYPT_SALT_ROUNDS` | Sí | Backend | Costo de hashing bcrypt. | `10` |
| `ADMIN_NAME` | Sí para seed | Backend | Nombre del administrador inicial. | `Administrador` |
| `ADMIN_EMAIL` | Sí para seed | Backend | Email del administrador inicial. | `admin.temporal@example.com` |
| `ADMIN_PASSWORD` | Sí para seed | Backend | Contraseña temporal fuerte del administrador. | `Cambiar_Esta_Clave_123*` |
| `LOGIN_RATE_LIMIT_WINDOW_MINUTES` | Sí | Backend | Ventana del límite de login. | `15` |
| `LOGIN_RATE_LIMIT_MAX` | Sí | Backend | Máximo de intentos de login por ventana. | `5` |
| `REGISTER_RATE_LIMIT_WINDOW_MINUTES` | Sí | Backend | Ventana del límite de registro. | `60` |
| `REGISTER_RATE_LIMIT_MAX` | Sí | Backend | Máximo de intentos de registro por ventana. | `10` |
| `TEST_DATABASE_URL` | Opcional | Backend | Reservada para pruebas con DB si se amplían. | vacío |
| `VITE_API_URL` | Sí | Frontend | URL base de la API. | `https://backend.example.com/api` |

## 7. Cambios en la base de datos

Tablas afectadas por los cambios de seguridad:

- `users`: se agregó `tokenVersion`.
- `incidents`: se usa estado `inactivo` dentro del enum del modelo.
- `audit_logs`: se amplió el uso funcional con nuevos eventos.
- `assets`, `risks`, `controls`: se reforzó validación y auditoría desde controladores.

Campo `tokenVersion`:

- Tabla: `users`.
- Tipo Sequelize: `INTEGER`.
- Restricción: `allowNull: false`.
- Valor predeterminado: `0`.
- Uso: se incluye en el JWT al iniciar sesión y se compara con el valor actual en BD en cada ruta protegida.
- Incrementa cuando: logout, cambio de contraseña, cambio de rol, cambio de estado de usuario y cambios sensibles gestionados desde usuarios.
- Efecto: si el token trae una versión distinta a la actual en BD, el middleware devuelve `401` y obliga a iniciar sesión nuevamente.
- Aplicación del cambio: `backend/src/database/migrate.ts` ejecuta `sequelize.sync({ alter: true })`. No hay migración SQL formal versionada; esto queda como limitación.

Relaciones relevantes:

- `Role` 1:N `User`.
- `User` 1:N `Incident` como creador y responsable.
- `Asset` 1:N `Risk`.
- `Risk` 1:N `Control`.
- `User` 1:N `AuditLog`.

## 8. Autenticación

Flujo actualizado:

1. Registro: `POST /api/auth/register` en `auth.routes.ts` llama a `authController.register`.
2. Hash de contraseña: `authService.register` usa `hashPassword` en `utils/password.ts`.
3. Inicio de sesión: `POST /api/auth/login` valida email/password y aplica rate limit.
4. Generación del JWT: `authService.login` firma `{ id, email, role, tokenVersion }`.
5. Contenido del JWT: id de usuario, email, rol textual y `tokenVersion`.
6. Validación del token: `auth.middleware.ts` usa `verifyToken`.
7. Consulta en PostgreSQL: el middleware busca `User.scope('withPassword').findByPk` con `Role`.
8. Estado del usuario: requiere `status === 'activo'`.
9. Rol actual: se toma desde la relación `role` cargada desde BD, no desde el token.
10. `tokenVersion`: debe coincidir entre JWT y BD.
11. Cierre de sesión: `POST /api/auth/logout` incrementa `tokenVersion`.
12. Invalidación: cualquier token anterior queda inválido cuando cambia `tokenVersion`.

Archivos involucrados: `backend/src/routes/auth.routes.ts`, `backend/src/controllers/auth.controller.ts`, `backend/src/services/auth.service.ts`, `backend/src/middlewares/auth.middleware.ts`, `backend/src/utils/jwt.ts`, `backend/src/utils/password.ts`.

## 9. Autorización y roles

Roles:

- Administrador: control total administrativo y auditoría.
- Analista de Seguridad: operación de incidentes, activos, riesgos y controles.
- Usuario: incidentes propios y perfil.

| Módulo o acción | Administrador | Analista | Usuario |
| --- | --- | --- | --- |
| Dashboard | Sí | Sí | Sí |
| Usuarios CRUD | Sí | No | No |
| Roles listado | Sí | No | No |
| Incidentes listar | Sí, todos | Sí, todos | Sí, propios no inactivos |
| Incidentes crear | Sí | Sí | Sí |
| Incidentes editar | Sí, excepto cerrados/inactivos | Sí, excepto cerrados/inactivos | Solo propios pendientes |
| Asignación de incidentes | Sí | Sí | No |
| Cierre de incidentes | Sí | Sí | No |
| Inactivación/cambio estado incidentes | Sí | Sí | No |
| Activos CRUD lógico | Sí | Sí | No |
| Riesgos CRUD lógico | Sí | Sí | No |
| Controles CRUD lógico | Sí | Sí | No |
| Auditoría | Sí | No | No |
| Perfil propio | Sí | Sí | Sí |
| Cambio de contraseña propio | Sí | Sí | Sí |

La autorización real está en `role.middleware.ts` y en reglas internas de controladores, especialmente `incidents.controller.ts`.

## 10. Política de contraseñas

Archivo central: `backend/src/validations/password.validation.ts`.

Reglas:

- Mínimo: 10 caracteres.
- Máximo: 128 caracteres.
- Debe incluir al menos una mayúscula.
- Debe incluir al menos una minúscula.
- Debe incluir al menos un número.
- Debe incluir al menos un carácter especial.
- No puede contener espacios.

Flujos donde se usa:

- Registro público.
- Creación y edición de usuarios.
- Cambio de contraseña.
- Seed de administrador.

Mensajes de validación: cada regla devuelve un mensaje específico como `La contraseña debe tener mínimo 10 caracteres` o `La contraseña debe incluir al menos un carácter especial`.

## 11. Protección contra fuerza bruta

- Login: `POST /api/auth/login` usa `loginLimiter`.
- Registro: `POST /api/auth/register` usa `registerLimiter`.
- Ventanas: configurables por `LOGIN_RATE_LIMIT_WINDOW_MINUTES` y `REGISTER_RATE_LIMIT_WINDOW_MINUTES`.
- Máximos: configurables por `LOGIN_RATE_LIMIT_MAX` y `REGISTER_RATE_LIMIT_MAX`.
- Identificación del cliente: comportamiento por defecto de `express-rate-limit`, basado principalmente en IP de Express.
- Proxy: `app.set('trust proxy', 1)` para Render/proxy.
- Respuesta al exceder login: `Demasiados intentos de inicio de sesión. Intente más tarde.`
- Respuesta al exceder registro: `Demasiados intentos de registro. Intente más tarde.`

## 12. Seguridad HTTP

- Helmet: activo globalmente en `app.ts`.
- CORS: configurado con función `origin`.
- Orígenes autorizados: `ALLOWED_ORIGINS` o fallback `FRONTEND_URL`.
- Solicitudes sin `Origin`: se permiten, útil para herramientas server-side, health checks o Postman.
- Credenciales: `credentials: true`.
- No se permite `*` en `ALLOWED_ORIGINS`.
- Errores: `error.middleware.ts` responde mensaje genérico y solo imprime detalle en desarrollo.
- HTTPS: Render sirve por HTTPS.
- PostgreSQL/Neon: en producción `database.ts` usa SSL con `require: true`.

## 13. Gestión de sesiones

- Almacenamiento frontend: `localStorage`.
- Clave centralizada: `SESSION_TOKEN_KEY = 'sisia_token'` en `frontend/src/api/session.ts`.
- En cada request, Axios agrega `Authorization: Bearer <token>`.
- Ante `401`, Axios remueve el token y emite evento `sisia:session-expired`.
- `AuthContext` limpia estado local y redirige a login al cerrar sesión.
- Logout backend incrementa `tokenVersion`.
- Limitación: `localStorage` es vulnerable si ocurre XSS.
- Mejora futura: cookies `HttpOnly`, `Secure` y `SameSite`.

## 14. Auditoría

| Acción auditada | Módulo | Usuario requerido | Información registrada |
| --- | --- | --- | --- |
| Login exitoso | `auth` | Sí | usuario, acción, módulo, recordId, IP, User-Agent |
| Login fallido | `auth` | No | acción, módulo, IP, User-Agent; no registra contraseña |
| Registro | `auth` | No | usuario creado, acción, módulo |
| Logout | `auth` | Sí | usuario, acción, módulo |
| Cambio de contraseña | `auth` | Sí | usuario, acción, módulo; no registra contraseñas |
| Edición de perfil | `auth` | Sí | usuario, acción, módulo |
| Revocación de sesión | `auth/users` | Sí | usuario afectado, acción, módulo |
| Creación de usuario | `users` | Administrador | usuario creado y actor |
| Cambio de rol | `users` | Administrador | usuario afectado |
| Cambio de estado usuario | `users` | Administrador | usuario afectado |
| Creación incidente | `incidents` | Cualquier autenticado | incidente creado |
| Edición incidente | `incidents` | Según rol/regla | incidente modificado |
| Asignación incidente | `incidents` | Admin/Analista | incidente y responsable |
| Cierre incidente | `incidents` | Admin/Analista | incidente cerrado |
| Cambio estado incidente | `incidents` | Admin/Analista | estado nuevo |
| Activos crear/editar/status | `assets` | Admin/Analista | activo afectado |
| Riesgos crear/editar/status | `risks` | Admin/Analista | riesgo afectado |
| Controles crear/editar/status | `controls` | Admin/Analista | control afectado |
| Acceso rechazado 401 | `auth` | No siempre | motivo genérico e IP/User-Agent |
| Acceso denegado 403 | `authorization` | Sí si token válido | rol insuficiente |

`auditService.log` registra `userId`, `action`, `module`, `recordId`, `description`, `ipAddress`, `userAgent` y `createdAt` por el modelo. Si falla, captura el error y no interrumpe la operación principal. No se registran contraseñas, tokens ni cadenas de conexión.

## 15. Incidentes

Flujo real:

- Creación: cualquier usuario autenticado puede crear.
- Consulta: Admin/Analista ven todos; Usuario ve propios y no inactivos.
- Edición: Admin/Analista no editan cerrados ni inactivos; Usuario solo propios pendientes.
- Asignación: Admin/Analista; responsable debe estar activo y ser Admin o Analista.
- Cambio de estado: Admin/Analista.
- Cierre: Admin/Analista; no se puede cerrar inactivo.
- Inactivación lógica: estado `inactivo`.
- Filtros: por creador para Usuario; por estado en conteos dashboard.

Estados válidos: `pendiente`, `en_proceso`, `cerrado`, `inactivo`.

Transiciones: el backend permite cambio directo a cualquier estado válido desde `changeStatus`; `close` fuerza `cerrado`. No existe una máquina formal de estados.

## 16. Activos de información

Campos administrados:

- `name`, `type`, `description`, `owner`.
- `confidentialityLevel`, `integrityLevel`, `availabilityLevel`.
- `status`.

Validaciones:

- Nombre obligatorio, máximo 140.
- Tipo obligatorio, máximo 80.
- Propietario obligatorio, máximo 120.
- Descripción máximo 2000.
- Niveles de seguridad: `bajo`, `medio`, `alto`.
- Estado normalizado a `activo` o `inactivo`.

Relación: `Asset.hasMany(Risk)` y `Risk.belongsTo(Asset)`.

## 17. Gestión de riesgos

Campos:

- `assetId`, `threat`, `vulnerability`, `probability`, `impact`, `riskScore`, `riskLevel`, `mitigationPlan`, `status`.

Reglas:

- Asociación obligatoria con activo activo.
- Amenaza y vulnerabilidad obligatorias, máximo 160.
- Plan de mitigación máximo 2000.
- Probabilidad e impacto enteros entre 1 y 5.
- Prevención de `NaN`.

Fórmula:

```text
riskScore = probability × impact
```

Clasificación en backend (`risk.service.ts`):

- 1 a 5: `bajo`.
- 6 a 10: `medio`.
- 11 a 15: `alto`.
- 16 a 25: `critico`.

## 18. Controles de seguridad

Campos:

- `riskId`, `name`, `description`, `type`, `status`.

Reglas:

- Asociación obligatoria con riesgo activo.
- Nombre obligatorio, máximo 140.
- Tipo obligatorio, máximo 60.
- Descripción máximo 2000.
- Estado permitido: `activo`, `inactivo`, `pendiente`, `implementado`.
- Prevención de `NaN` para `riskId`.
- Auditoría en creación, edición y cambio de estado.

## 19. Validaciones implementadas

| Módulo | Campo | Validación | Archivo |
| --- | --- | --- | --- |
| Auth | email | requerido y formato email | `auth.validation.ts` |
| Auth | password | requerido en login | `auth.validation.ts` |
| Password | password | mínimo, máximo, mayúscula, minúscula, número, especial, sin espacios | `password.validation.ts` |
| Usuario | name | requerido, máximo 120, trim | `user.validation.ts`, `users.controller.ts` |
| Usuario | email | requerido, formato, trim, lowercase, único | `user.validation.ts`, `users.controller.ts` |
| Usuario | roleId | requerido, existe en BD | `users.controller.ts` |
| Usuario | status | `activo` o `inactivo` | `users.controller.ts` |
| Incidente | title | requerido, máximo 160, trim | `incident.validation.ts` |
| Incidente | description | requerido, trim | `incident.validation.ts` |
| Incidente | category | requerido, máximo 80, trim | `incident.validation.ts` |
| Incidente | priority | `baja`, `media`, `alta`, `critica` | `incident.validation.ts` |
| Incidente | status | `pendiente`, `en_proceso`, `cerrado`, `inactivo` | `incident.validation.ts` |
| Activo | name/type/owner | requeridos, longitudes máximas | `assets.controller.ts` |
| Activo | CIA levels | `bajo`, `medio`, `alto` | `assets.controller.ts` |
| Riesgo | assetId | numérico, existe y activo | `risks.controller.ts` |
| Riesgo | probability/impact | enteros 1 a 5, no NaN | `risks.controller.ts` |
| Riesgo | threat/vulnerability | requeridos, máximo 160 | `risks.controller.ts` |
| Control | riskId | numérico, existe y activo | `controls.controller.ts` |
| Control | name/type | requeridos, longitudes máximas | `controls.controller.ts` |
| Control | status | enum funcional | `controls.controller.ts` |

## 20. Pruebas automatizadas

Framework: Vitest. Pruebas HTTP: Supertest. Base de datos: no se usa base real en las pruebas actuales; se emplean mocks y pruebas unitarias/controladas.

| Prueba | Archivo | Resultado | Qué valida |
| --- | --- | --- | --- |
| Contraseña fuerte aceptada | `password.validation.test.ts` | Aprobada | Política permite contraseña válida. |
| Contraseña débil rechazada | `password.validation.test.ts` | Aprobada | Política rechaza entradas inseguras. |
| Cálculo de riesgo | `risk.service.test.ts` | Aprobada | Score y niveles bajo/medio/alto/crítico. |
| Login fallido auditado | `auth.controller.test.ts` | Aprobada | Auditoría sin registrar contraseña. |
| Sin token | `auth.middleware.test.ts` | Aprobada | Respuesta 401. |
| Token inválido | `auth.middleware.test.ts` | Aprobada | Respuesta 401. |
| Usuario inactivo | `auth.middleware.test.ts` | Aprobada | Respuesta 401. |
| `tokenVersion` distinto | `auth.middleware.test.ts` | Aprobada | Token revocado. |
| Rol actual desde BD | `auth.middleware.test.ts` | Aprobada | Respuesta 403 si perdió permisos. |
| Admin válido | `auth.middleware.test.ts` | Aprobada | Acceso permitido. |
| Incidente ajeno | `incidents.controller.test.ts` | Aprobada | Usuario no accede a incidente ajeno. |
| Usuario edita en proceso | `incidents.controller.test.ts` | Aprobada | Usuario no edita incidente no pendiente. |

Comando ejecutado:

```bash
cd backend
npm run test:run
```

Resultado real: 5 archivos de prueba aprobados, 12 pruebas aprobadas, 0 fallidas. Cobertura no ejecutada.

## 21. Build y verificación

| Comando | Resultado | Observaciones |
| --- | --- | --- |
| `backend: npm install` | Correcto | Reporta 10 vulnerabilidades npm: 5 moderate, 4 high, 1 critical. |
| `backend: npm run build` | Correcto | TypeScript compila con `tsc`. |
| `backend: npm run test:run` | Correcto | 12 pruebas aprobadas. |
| `frontend: npm install` | Correcto | Reporta 1 vulnerabilidad high. |
| `frontend: npm run build` | Correcto | Vite genera `dist`. |

Nota: en esta sesión el sandbox bloqueó Node con `EPERM` al resolver `C:\Users\pasantesis1`; los comandos se ejecutaron fuera del sandbox con aprobación.

## 22. Despliegue

Render:

- Backend: Web Service.
- Root directory backend: `backend`.
- Build command backend: `npm install --include=dev && npm run build`.
- Start command backend: `npm start`.
- Frontend: Static Site.
- Root directory frontend: `frontend`.
- Build command frontend: `npm install --include=dev && npm run build`.
- Publish directory: `dist`.
- Rewrite React Router: `/* -> /index.html`.

Variables requeridas:

- Backend: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `ALLOWED_ORIGINS`, `BCRYPT_SALT_ROUNDS`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, rate limit variables.
- Frontend: `VITE_API_URL`.

PostgreSQL/Neon:

- La conexión usa `DATABASE_URL`.
- En producción se habilita SSL desde `database.ts`.
- Después de cambios de modelo, ejecutar `npm run db:migrate`.
- Después de preparar roles/admin inicial, ejecutar `npm run db:seed`.

## 23. Correspondencia con los requisitos universitarios

| Requisito universitario | Implementación en SISIA Cloud | Evidencia en archivos | Estado |
| --- | --- | --- | --- |
| Registro e inicio de sesión | Auth con registro/login JWT | `auth.controller.ts`, `auth.routes.ts` | Cumplido |
| CRUD | Usuarios, incidentes, activos, riesgos, controles | controladores y rutas respectivos | Cumplido |
| Tres roles | Administrador, Analista, Usuario | `seed.ts`, `roles.routes.ts` | Cumplido |
| Control de acceso | Middlewares y reglas en controladores | `auth.middleware.ts`, `role.middleware.ts` | Cumplido |
| Hash de contraseñas | bcrypt | `utils/password.ts`, `auth.service.ts` | Cumplido |
| Auditoría | `AuditLog` y `auditService` | `AuditLog.ts`, `audit.service.ts` | Cumplido |
| Activos de información | Modelo/rutas/controlador frontend/backend | `Asset.ts`, `assets.controller.ts` | Cumplido |
| Análisis de riesgos | Riesgos con score/nivel | `Risk.ts`, `risk.service.ts` | Cumplido |
| Controles | Controles asociados a riesgos | `Control.ts`, `controls.controller.ts` | Cumplido |
| Arquitectura de seguridad | Documentada | `docs/arquitectura.md` | Cumplido |
| Protección de datos | Password oculto, env vars, tokenVersion | `User.ts`, `env.ts` | Cumplido |
| Protección de comunicaciones | HTTPS Render y SSL Neon documentado/configurado para producción | `render.yaml`, `database.ts` | Parcial |

## 24. Riesgos corregidos

| Riesgo anterior | Cambio aplicado | Resultado esperado |
| --- | --- | --- |
| Credenciales administrativas en código | Seed usa `ADMIN_*` | No hay admin real quemado en código. |
| Rol desactualizado en JWT | Auth consulta rol actual en BD | Cambios de rol aplican inmediatamente. |
| Tokens válidos después del logout | `tokenVersion` incrementa en logout | Token anterior devuelve 401. |
| Contraseñas débiles | Política central fuerte | Menos riesgo de credenciales débiles. |
| Fuerza bruta | Rate limit login/registro | Menos abuso de endpoints públicos. |
| CORS permisivo/inflexible | `ALLOWED_ORIGINS` y no `*` | Orígenes controlados. |
| Falta de auditoría de accesos fallidos | `LOGIN_FAILED`, `ACCESS_REJECTED`, `ACCESS_DENIED` | Mayor trazabilidad. |
| Acciones inconsistentes en incidentes | Reglas para cerrado/inactivo/propios | Menos cambios indebidos. |
| Estados inactivos inconsistentes | Estado `inactivo` y filtros | Eliminación lógica más clara. |
| Validaciones incompletas | Longitudes, enums, NaN, relaciones activas | Menos errores y datos inválidos. |

## 25. Limitaciones actuales

- El frontend usa `localStorage` para JWT.
- No hay cookies `HttpOnly`, `Secure`, `SameSite`.
- No hay segundo factor de autenticación.
- No hay recuperación de contraseña.
- Migraciones usan `sequelize.sync({ alter: true })`, no migraciones versionadas formales.
- Auditoría no es transaccional; se ejecuta como best effort.
- `auditService` no reintenta ni envía alertas si falla.
- Dependencia de Render y Neon para producción.
- `npm install` reporta vulnerabilidades pendientes en dependencias.
- No hay cobertura de tests publicada; solo ejecución de tests.
- No hay pruebas e2e del frontend.
- La máquina de estados de incidentes no está formalizada; `changeStatus` acepta cualquier estado válido.

## 26. Recomendaciones futuras

Crítica:

- Revisar vulnerabilidades npm y aplicar actualizaciones controladas.
- Reemplazar `sequelize.sync({ alter: true })` por migraciones versionadas.

Alta:

- Migrar JWT a cookies `HttpOnly`, `Secure`, `SameSite`.
- Implementar recuperación segura de contraseña.
- Agregar pruebas de integración con base de datos de test aislada.

Media:

- Implementar máquina formal de estados de incidentes.
- Agregar pruebas e2e del frontend.
- Agregar alertas o persistencia alternativa ante fallos de auditoría.

Baja:

- Agregar cobertura de tests y reporte HTML/CI.
- Mejorar documentación con capturas reales de pantalla.
- Agregar búsqueda/filtros avanzados en auditoría.

## 27. Evidencias técnicas para documentación

| Evidencia | Pantalla o comando | Qué demuestra |
| --- | --- | --- |
| Login | Pantalla `/login` | Autenticación funcional. |
| Registro | Pantalla `/register` | Registro con política de contraseña. |
| Dashboard por rol | `/dashboard` con usuarios distintos | Métricas y visibilidad por rol. |
| Gestión de usuarios | `/users` | CRUD administrativo. |
| Incidentes | `/incidents` | Creación/listado/edición. |
| Asignación | Acción de responsable en incidente | Permiso Admin/Analista. |
| Cierre | Acción cerrar incidente | Estado cerrado y auditoría. |
| Inactivación | Cambio a `inactivo` | Eliminación lógica. |
| Activos | `/assets` | Gestión de activos. |
| Riesgos | `/risks` | Relación con activos. |
| Cálculo de riesgo | Crear riesgo con probabilidad/impacto | `riskScore` y `riskLevel`. |
| Controles | `/controls` | Relación con riesgos. |
| Auditoría | `/audit` | Eventos registrados. |
| 401 | Token inválido o expirado | Protección de rutas. |
| 403 | Usuario común en `/assets` o `/audit` | Autorización por rol. |
| Rate limiting | Repetir login fallido | Protección contra fuerza bruta. |
| HTTPS | URL Render | Comunicación cifrada. |
| Base de datos | Neon dashboard o consulta segura | Persistencia PostgreSQL. |
| Tests | `npm run test:run` | 12 pruebas aprobadas. |
| Build | `npm run build` backend/frontend | Compilación correcta. |

## 28. Estado final

Funcionalidades completamente implementadas:

- Registro e inicio de sesión.
- JWT con expiración y revocación por `tokenVersion`.
- Roles y autorización backend.
- Perfil y cambio de contraseña.
- Usuarios, incidentes, activos, riesgos, controles y auditoría.
- Dashboard con métricas reales.
- Validaciones principales.
- Build backend/frontend.
- Pruebas automatizadas backend actuales.

Funcionalidades parcialmente implementadas:

- Seguridad de sesión: funcional con `localStorage`, pendiente cookies seguras.
- Migraciones: funcional con Sequelize sync alter, pendiente migraciones formales.
- Auditoría: funcional best effort, pendiente transaccionalidad/alertas.
- Protección de comunicaciones: preparada para Render/Neon; depende de despliegue correcto.

Funcionalidades pendientes:

- Recuperación de contraseña.
- Segundo factor.
- Pruebas e2e frontend.
- Corrección controlada de vulnerabilidades npm.
- Cobertura de tests.

Errores conocidos:

- No se detectaron errores de compilación ni pruebas fallidas.
- `npm install` reporta vulnerabilidades de dependencias pendientes.

Resultado general:

El sistema queda en estado funcional y documentable para entrega académica, con controles de seguridad razonables para el alcance del proyecto. Se recomienda resolver vulnerabilidades npm y preparar migraciones formales antes de considerarlo listo para producción estricta.

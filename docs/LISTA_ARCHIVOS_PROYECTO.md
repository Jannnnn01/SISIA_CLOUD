# Lista de Archivos Relevantes del Proyecto

Este documento resume el árbol importante de SISIA Cloud. No incluye `node_modules`, `dist`, archivos temporales ni `.env` reales.

## Raíz del proyecto

| Archivo o carpeta | Descripción |
| --- | --- |
| `README.md` | Guía principal de instalación, configuración, despliegue y seguridad. |
| `render.yaml` | Configuración declarativa para Render: backend web service y frontend static site. |
| `.gitignore` | Exclusiones de Git, incluyendo entornos locales y artefactos generados. |
| `LICENSE` | Licencia del proyecto. |
| `backend/` | API REST con Express, TypeScript, Sequelize y PostgreSQL. |
| `frontend/` | Aplicación React/Vite/TypeScript. |
| `docs/` | Documentación técnica, matriz de riesgos y reportes. |

## Backend

| Archivo | Descripción |
| --- | --- |
| `backend/package.json` | Dependencias, scripts de build, start, migración, seed y pruebas. |
| `backend/package-lock.json` | Versiones bloqueadas de dependencias npm. |
| `backend/.env.example` | Plantilla segura de variables de entorno backend. |
| `backend/tsconfig.json` | Configuración TypeScript del backend. |
| `backend/src/server.ts` | Punto de arranque HTTP del backend. |
| `backend/src/app.ts` | Configuración Express: Helmet, CORS, JSON, rutas y middleware de errores. |
| `backend/src/config/env.ts` | Lectura y validación de variables de entorno. |
| `backend/src/config/database.ts` | Configuración Sequelize con `DATABASE_URL` y SSL en producción. |
| `backend/src/database/migrate.ts` | Migración actual mediante `sequelize.sync({ alter: true })`. |
| `backend/src/database/seed.ts` | Creación de roles y administrador inicial desde variables `ADMIN_*`. |

## Backend - Modelos

| Archivo | Descripción |
| --- | --- |
| `backend/src/models/Role.ts` | Modelo de roles del sistema. |
| `backend/src/models/User.ts` | Modelo de usuarios, status y `tokenVersion`. |
| `backend/src/models/Incident.ts` | Modelo de incidentes y estados. |
| `backend/src/models/Asset.ts` | Modelo de activos de información. |
| `backend/src/models/Risk.ts` | Modelo de riesgos, score y nivel. |
| `backend/src/models/Control.ts` | Modelo de controles asociados a riesgos. |
| `backend/src/models/AuditLog.ts` | Modelo de auditoría. |
| `backend/src/models/index.ts` | Asociaciones Sequelize entre modelos. |

## Backend - Rutas

| Archivo | Descripción |
| --- | --- |
| `backend/src/routes/auth.routes.ts` | Login, registro, usuario actual, perfil, contraseña y logout. |
| `backend/src/routes/users.routes.ts` | CRUD de usuarios y usuarios asignables. |
| `backend/src/routes/roles.routes.ts` | Listado de roles para administrador. |
| `backend/src/routes/incidents.routes.ts` | Incidentes, asignación, cierre y estado. |
| `backend/src/routes/assets.routes.ts` | CRUD lógico de activos. |
| `backend/src/routes/risks.routes.ts` | CRUD lógico de riesgos. |
| `backend/src/routes/controls.routes.ts` | CRUD lógico de controles. |
| `backend/src/routes/audit.routes.ts` | Listado de auditoría para administrador. |
| `backend/src/routes/dashboard.routes.ts` | Dashboard protegido. |

## Backend - Controladores

| Archivo | Descripción |
| --- | --- |
| `backend/src/controllers/auth.controller.ts` | Autenticación, registro, perfil, cambio de contraseña y logout. |
| `backend/src/controllers/users.controller.ts` | Gestión administrativa de usuarios. |
| `backend/src/controllers/roles.controller.ts` | Consulta de roles. |
| `backend/src/controllers/incidents.controller.ts` | Reglas de negocio de incidentes. |
| `backend/src/controllers/assets.controller.ts` | Reglas de activos. |
| `backend/src/controllers/risks.controller.ts` | Reglas de riesgos y validación de activo. |
| `backend/src/controllers/controls.controller.ts` | Reglas de controles y validación de riesgo. |
| `backend/src/controllers/audit.controller.ts` | Consulta de eventos de auditoría. |
| `backend/src/controllers/dashboard.controller.ts` | Métricas reales por rol. |

## Backend - Middlewares, servicios y utilidades

| Archivo | Descripción |
| --- | --- |
| `backend/src/middlewares/auth.middleware.ts` | Valida JWT, usuario activo, rol actual y `tokenVersion`. |
| `backend/src/middlewares/role.middleware.ts` | Autoriza acciones por rol y audita denegaciones. |
| `backend/src/middlewares/error.middleware.ts` | Respuesta genérica de errores internos. |
| `backend/src/services/auth.service.ts` | Login, registro, JWT y respuesta pública de usuario. |
| `backend/src/services/audit.service.ts` | Registro no bloqueante de auditoría. |
| `backend/src/services/risk.service.ts` | Cálculo de score y nivel de riesgo. |
| `backend/src/utils/jwt.ts` | Firma y verificación de JWT. |
| `backend/src/utils/password.ts` | Hash y comparación bcrypt. |
| `backend/src/utils/response.ts` | Respuestas JSON estándar. |
| `backend/src/types/express.d.ts` | Extensión de tipos Express para `req.user`. |

## Backend - Validaciones y pruebas

| Archivo | Descripción |
| --- | --- |
| `backend/src/validations/auth.validation.ts` | Validación básica de email/password. |
| `backend/src/validations/password.validation.ts` | Política central de contraseña fuerte. |
| `backend/src/validations/user.validation.ts` | Validación de usuarios. |
| `backend/src/validations/incident.validation.ts` | Validación de incidentes. |
| `backend/tests/auth.controller.test.ts` | Prueba de login fallido y auditoría. |
| `backend/tests/auth.middleware.test.ts` | Pruebas de token, usuario, rol y `tokenVersion`. |
| `backend/tests/incidents.controller.test.ts` | Pruebas de permisos de incidentes. |
| `backend/tests/password.validation.test.ts` | Pruebas de política de contraseña. |
| `backend/tests/risk.service.test.ts` | Prueba de clasificación de riesgo. |

## Frontend

| Archivo | Descripción |
| --- | --- |
| `frontend/package.json` | Dependencias y scripts de React/Vite. |
| `frontend/package-lock.json` | Versiones bloqueadas frontend. |
| `frontend/.env.example` | Plantilla de `VITE_API_URL`. |
| `frontend/index.html` | HTML base de Vite. |
| `frontend/vite.config.ts` | Configuración Vite. |
| `frontend/tsconfig.json` | Configuración TypeScript. |
| `frontend/tailwind.config.cjs` | Configuración Tailwind. |
| `frontend/postcss.config.cjs` | Configuración PostCSS. |
| `frontend/src/main.tsx` | Punto de entrada React. |
| `frontend/src/App.tsx` | Componente raíz. |
| `frontend/src/index.css` | Estilos globales Tailwind. |

## Frontend - API y sesión

| Archivo | Descripción |
| --- | --- |
| `frontend/src/api/axios.ts` | Cliente Axios, token Bearer y limpieza en 401. |
| `frontend/src/api/session.ts` | Clave centralizada `sisia_token`. |
| `frontend/src/api/auth.api.ts` | Llamadas de autenticación. |
| `frontend/src/api/users.api.ts` | Llamadas de usuarios. |
| `frontend/src/api/roles.api.ts` | Llamadas de roles. |
| `frontend/src/api/incidents.api.ts` | Llamadas de incidentes. |
| `frontend/src/api/assets.api.ts` | Llamadas de activos. |
| `frontend/src/api/risks.api.ts` | Llamadas de riesgos. |
| `frontend/src/api/controls.api.ts` | Llamadas de controles. |
| `frontend/src/api/audit.api.ts` | Llamadas de auditoría. |
| `frontend/src/context/AuthContext.tsx` | Estado global de autenticación, login, registro y logout. |
| `frontend/src/hooks/useAuth.ts` | Hook para consumir `AuthContext`. |

## Frontend - Rutas, layout y páginas

| Archivo | Descripción |
| --- | --- |
| `frontend/src/routes/AppRoutes.tsx` | Definición de rutas públicas/protegidas. |
| `frontend/src/routes/ProtectedRoute.tsx` | Protección de rutas autenticadas. |
| `frontend/src/routes/RoleBasedRoute.tsx` | Protección por rol en frontend. |
| `frontend/src/components/layout/navItems.ts` | Menú lateral filtrado por rol. |
| `frontend/src/components/layout/MainLayout.tsx` | Layout principal autenticado. |
| `frontend/src/components/layout/Navbar.tsx` | Barra superior. |
| `frontend/src/components/layout/Sidebar.tsx` | Navegación lateral. |
| `frontend/src/pages/LoginPage.tsx` | Inicio de sesión sin credenciales precargadas. |
| `frontend/src/pages/RegisterPage.tsx` | Registro de usuario. |
| `frontend/src/pages/DashboardPage.tsx` | Dashboard protegido. |
| `frontend/src/pages/ProfilePage.tsx` | Perfil y cambio de contraseña. |
| `frontend/src/pages/UsersPage.tsx` | Gestión de usuarios. |
| `frontend/src/pages/IncidentsPage.tsx` | Gestión de incidentes. |
| `frontend/src/pages/AssetsPage.tsx` | Gestión de activos. |
| `frontend/src/pages/RisksPage.tsx` | Gestión de riesgos. |
| `frontend/src/pages/ControlsPage.tsx` | Gestión de controles. |
| `frontend/src/pages/AuditLogsPage.tsx` | Consulta de auditoría. |

## Frontend - Componentes UI

| Archivo | Descripción |
| --- | --- |
| `frontend/src/components/ui/Alert.tsx` | Mensajes de alerta. |
| `frontend/src/components/ui/Badge.tsx` | Etiquetas visuales de estado. |
| `frontend/src/components/ui/Button.tsx` | Botón reutilizable. |
| `frontend/src/components/ui/Card.tsx` | Contenedor visual. |
| `frontend/src/components/ui/Input.tsx` | Campo reutilizable. |

## Documentación

| Archivo | Descripción |
| --- | --- |
| `docs/arquitectura.md` | Arquitectura de seguridad y flujo general. |
| `docs/controles-seguridad.md` | Controles implementados y limitaciones. |
| `docs/matriz-riesgos.md` | Matriz de riesgos académica. |
| `docs/REPORTE_CAMBIOS_SEGURIDAD.md` | Reporte detallado de cambios de seguridad. |
| `docs/LISTA_ARCHIVOS_PROYECTO.md` | Este inventario de archivos relevantes. |

## Archivos no incluidos

No se incluyen:

- `node_modules/`.
- `dist/`.
- `.env` reales.
- Archivos temporales.
- Cachés o artefactos generados localmente.

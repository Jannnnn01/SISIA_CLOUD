# Arquitectura de Seguridad

SISIA Cloud separa responsabilidades en frontend, backend y base de datos. El frontend React consume una API REST protegida por JWT. El backend Express valida solicitudes, aplica permisos por rol y persiste información mediante Sequelize en PostgreSQL.

## Componentes

- Frontend: interfaz de usuario, rutas protegidas y consumo de API.
- Backend: autenticación, autorización, reglas de negocio y auditoría.
- PostgreSQL: almacenamiento de usuarios, roles, incidentes, activos, riesgos, controles y eventos de auditoría.

## Comunicaciones

En producción, Render entrega HTTPS para proteger la comunicación entre navegador, API y servicios cloud. Las URLs permitidas se controlan desde `FRONTEND_URL`.

## Controles aplicados

- JWT con expiración.
- bcrypt para contraseñas.
- CORS restringido.
- Variables de entorno.
- Auditoría de acciones relevantes.
- Separación de roles y permisos.

# Controles de Seguridad

## Autenticación

El sistema valida usuarios mediante email y contraseña. Las contraseñas se almacenan usando bcrypt, nunca en texto plano.

## Autorización

Los permisos se aplican por rol:

- Administrador: acceso total.
- Analista de Seguridad: gestión operativa de seguridad.
- Usuario: acceso limitado a su propia información.

## Auditoría

Se registran eventos relevantes como login, registro, creación de usuarios, creación de incidentes y cambios de estado.

## Protección de configuración

Las credenciales, secretos JWT, URL del frontend y conexión PostgreSQL se manejan mediante variables de entorno.

## Disponibilidad y despliegue

Render permite desplegar el backend y frontend con HTTPS. PostgreSQL cloud centraliza la persistencia y facilita continuidad operativa.

# Controles de Seguridad

## Autenticación

- Inicio de sesión con email y contraseña.
- Contraseñas almacenadas con bcrypt.
- Política de contraseña fuerte: 10 a 128 caracteres, mayúscula, minúscula, número, carácter especial y sin espacios.
- JWT con expiración definida en `JWT_EXPIRES_IN`.
- `tokenVersion` para revocar tokens antiguos.

## Autorización

- Middleware de autenticación en rutas protegidas.
- Middleware por roles para Administrador, Analista de Seguridad y Usuario.
- El backend consulta el rol actual en base de datos y no confía en el rol del token.
- Usuarios inactivos no pueden iniciar sesión ni usar tokens emitidos antes de la inactivación.

## Auditoría

Se registran eventos de:

- Login exitoso y fallido.
- Registro de usuario.
- Logout.
- Cambio de contraseña.
- Edición de perfil.
- Creación, edición y cambio de estado de usuarios.
- Creación, edición y cambio de estado de incidentes, activos, riesgos y controles.
- Cambios de rol, cambios de estado y revocación de sesiones.
- Acceso rechazado por token inválido, sesión revocada o rol insuficiente.

La auditoría es no bloqueante: si falla el registro del evento, no debe romper una operación ya validada.

## Protección de Configuración

- `DATABASE_URL`, `JWT_SECRET`, URLs y credenciales temporales se manejan por variables de entorno.
- `.env` no debe versionarse.
- `.env.example` solo contiene placeholders.
- En producción `JWT_SECRET` debe tener mínimo 32 caracteres.

## Seguridad HTTP

- Helmet aplica cabeceras HTTP seguras.
- CORS restringido con `ALLOWED_ORIGINS` o `FRONTEND_URL`.
- No se permite `*` como origen cuando se usan credenciales.
- Render sirve frontend y backend mediante HTTPS.
- Neon usa conexión PostgreSQL con SSL.

## Protección Contra Abuso

- Rate limiting específico para login.
- Rate limiting específico para registro.
- Mensajes de error amigables sin trazas técnicas para usuarios finales.

## Datos y Ciclo de Vida

- No se devuelve `password` ni `tokenVersion` en respuestas públicas.
- Eliminación lógica mediante `status`.
- Estados de incidentes controlados: `pendiente`, `en_proceso`, `cerrado`, `inactivo`.
- Riesgos calculan `riskScore = probability * impact`.
- Nivel de riesgo:
  - 1 a 5: Bajo.
  - 6 a 10: Medio.
  - 11 a 15: Alto.
  - 16 a 25: Crítico.

## Limitación Documentada

El frontend conserva el JWT en `localStorage` por simplicidad académica. En un entorno productivo más estricto, se recomienda migrar a cookies `HttpOnly`, `Secure` y `SameSite`.

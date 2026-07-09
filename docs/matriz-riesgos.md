# Matriz de Riesgos

La matriz resume riesgos relevantes para SISIA Cloud. El puntaje se calcula como `probabilidad * impacto`, usando valores de 1 a 5.

## Criterio de Clasificación

- 1 a 5: Bajo.
- 6 a 10: Medio.
- 11 a 15: Alto.
- 16 a 25: Crítico.

| ID | Activo | Amenaza | Vulnerabilidad | Probabilidad | Impacto | Puntaje | Nivel | Control implementado | Tratamiento | Riesgo residual | Responsable | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Cuentas de usuario | Acceso no autorizado | Contraseñas débiles | 4 | 4 | 16 | Crítico | Política fuerte, bcrypt, rate limit | Mitigar | Medio | Administrador | Activo |
| R-002 | Sesiones | Uso de token robado | Token persistente en cliente | 3 | 4 | 12 | Alto | JWT con expiración y tokenVersion | Mitigar | Medio | Administrador | Activo |
| R-003 | Roles | Escalada de privilegios | Confiar en rol del token | 3 | 5 | 15 | Alto | Consulta de rol actual en BD | Mitigar | Bajo | Administrador | Activo |
| R-004 | Usuarios | Uso de cuenta inactiva | Token previo a desactivación | 3 | 4 | 12 | Alto | Validación de status y revocación | Mitigar | Bajo | Administrador | Activo |
| R-005 | Incidentes | Manipulación de estado | Falta de validación de estados | 3 | 4 | 12 | Alto | Enums y reglas por rol | Mitigar | Medio | Analista | Activo |
| R-006 | Activos | Pérdida de inventario | Borrado físico | 2 | 4 | 8 | Medio | Eliminación lógica por status | Mitigar | Bajo | Analista | Activo |
| R-007 | Riesgos | Cálculo incorrecto | Fórmula manual inconsistente | 3 | 3 | 9 | Medio | Cálculo automático de score y nivel | Mitigar | Bajo | Analista | Activo |
| R-008 | Controles | Control sin trazabilidad | Falta de asociación con riesgo | 2 | 4 | 8 | Medio | Relación Control-Risk | Mitigar | Bajo | Analista | Activo |
| R-009 | Auditoría | Pérdida de evidencia | Acciones relevantes sin log | 3 | 5 | 15 | Alto | AuditLog centralizado | Mitigar | Medio | Administrador | Activo |
| R-010 | API | Fuerza bruta de login | Sin límite de intentos | 4 | 4 | 16 | Crítico | express-rate-limit | Mitigar | Medio | Administrador | Activo |
| R-011 | Configuración | Exposición de secretos | Credenciales en código | 2 | 5 | 10 | Medio | Variables de entorno y .gitignore | Mitigar | Bajo | Administrador | Activo |
| R-012 | Comunicación | Interceptación | HTTP sin cifrado | 3 | 5 | 15 | Alto | HTTPS en Render y SSL Neon | Mitigar | Bajo | Administrador | Activo |
| R-013 | Frontend | Acceso visual no autorizado | Menú sin control por rol | 3 | 3 | 9 | Medio | Menú y rutas protegidas por rol | Mitigar | Bajo | Desarrollador | Activo |
| R-014 | Backend | Acceso directo por URL | Falta de autorización server-side | 3 | 5 | 15 | Alto | Middleware de autenticación y roles | Mitigar | Bajo | Desarrollador | Activo |
| R-015 | Disponibilidad | Abuso de endpoints públicos | Registro/login sin control | 3 | 4 | 12 | Alto | Rate limit y errores genéricos | Mitigar | Medio | Administrador | Activo |

Esta matriz sirve como base académica y está alineada con los controles implementados en backend y frontend.

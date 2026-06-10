# Matriz de Riesgos

La matriz de riesgos permite identificar amenazas, vulnerabilidades, probabilidad, impacto y controles asociados a activos de información académicos.

| Activo | Amenaza | Vulnerabilidad | Probabilidad | Impacto | Nivel | Control sugerido |
| --- | --- | --- | --- | --- | --- | --- |
| Cuentas de usuario | Acceso no autorizado | Contraseñas débiles | Media | Alta | Alto | bcrypt, JWT, roles |
| Incidentes | Manipulación de información | Falta de auditoría | Media | Alta | Alto | Logs de auditoría |
| Base de datos | Exposición de datos | Secretos en código | Baja | Alta | Medio | Variables de entorno |
| Comunicación | Interceptación | HTTP sin cifrado | Media | Alta | Alto | HTTPS en Render |

## Criterio inicial

El nivel se calcula combinando probabilidad e impacto. En fases posteriores, el módulo de riesgos puede automatizar el cálculo y asociarlo a controles específicos.

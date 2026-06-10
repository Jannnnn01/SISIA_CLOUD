# Migraciones

En esta primera fase, `npm run db:migrate` ejecuta `sequelize.sync({ alter: true })` desde TypeScript para crear o ajustar las tablas en PostgreSQL usando `DATABASE_URL`.

import { app } from './app';
import { sequelize } from './config/database';
import { env, useEmbeddedDatabase } from './config/env';
import { seedInitialData } from './database/seed';

const start = async () => {
  try {
    await sequelize.authenticate();
    if (useEmbeddedDatabase) {
      await sequelize.sync();
      await seedInitialData();
      console.log('Base de datos embebida preparada para desarrollo');
    }
    app.listen(env.port, () => {
      console.log(`SISIA Cloud backend escuchando en puerto ${env.port}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el backend');
    if (env.nodeEnv === 'development') console.error(error);
    process.exit(1);
  }
};

start();

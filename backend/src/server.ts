import { app } from './app';
import { sequelize } from './config/database';
import { env } from './config/env';

const start = async () => {
  try {
    await sequelize.authenticate();
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

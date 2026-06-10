import '../models';
import { sequelize } from '../config/database';

const migrate = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('Migración aplicada con Sequelize sync.');
  await sequelize.close();
};

migrate().catch((error) => {
  console.error('Error ejecutando migración');
  console.error(error);
  process.exit(1);
});

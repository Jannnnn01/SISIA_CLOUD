import '../models';
import { sequelize } from '../config/database';
import { Role, User } from '../models';
import { hashPassword } from '../utils/password';

const seed = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const roles = [
    { name: 'Administrador', description: 'Acceso total al sistema' },
    { name: 'Analista de Seguridad', description: 'Gestiona incidentes, activos, riesgos y controles' },
    { name: 'Usuario', description: 'Crea y consulta sus propios incidentes' }
  ];

  for (const role of roles) {
    await Role.findOrCreate({ where: { name: role.name }, defaults: role });
  }

  const adminRole = await Role.findOne({ where: { name: 'Administrador' } });
  if (!adminRole) throw new Error('No se pudo crear el rol Administrador');

  const [admin, created] = await User.findOrCreate({
    where: { email: 'admin@sisia.com' },
    defaults: {
      name: 'Administrador',
      email: 'admin@sisia.com',
      password: await hashPassword('Admin12345*'),
      roleId: adminRole.id,
      status: 'activo'
    }
  });

  if (!created) {
    await admin.update({
      roleId: adminRole.id,
      status: 'activo',
      password: await hashPassword('Admin12345*')
    });
  }

  console.log('Seed inicial aplicado.');
  await sequelize.close();
};

seed().catch((error) => {
  console.error('Error ejecutando seed');
  console.error(error);
  process.exit(1);
});

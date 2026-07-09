import '../models';
import { sequelize } from '../config/database';
import { Role, User } from '../models';
import { hashPassword } from '../utils/password';

export const seedInitialData = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const roles = [
    { name: 'Administrador', description: 'Acceso total al sistema' },
    { name: 'Analista de Seguridad', description: 'Gestiona incidentes, activos, riesgos y controles' },
    { name: 'Usuario', description: 'Crea y consulta sus propios incidentes' }
  ];

  for (const role of roles) {
    const existingRole = await Role.findOne({ where: { name: role.name } });
    if (!existingRole) await Role.create(role);
  }

  const adminRole = await Role.findOne({ where: { name: 'Administrador' } });
  if (!adminRole) throw new Error('No se pudo crear el rol Administrador');

  const admin = await User.scope('withPassword').findOne({ where: { email: 'admin@sisia.com' } });

  if (!admin) {
    await User.create({
      name: 'Administrador',
      email: 'admin@sisia.com',
      password: await hashPassword('Admin12345*'),
      roleId: adminRole.id,
      status: 'activo'
    });
  } else {
    await admin.update({
      roleId: adminRole.id,
      status: 'activo',
      password: await hashPassword('Admin12345*')
    });
  }
};

if (require.main === module) {
  seedInitialData()
    .then(async () => {
      console.log('Seed inicial aplicado.');
      await sequelize.close();
    })
    .catch((error) => {
      console.error('Error ejecutando seed');
      console.error(error);
      process.exit(1);
    });
}

import '../models';
import { sequelize } from '../config/database';
import { env } from '../config/env';
import { Role, User } from '../models';
import { hashPassword } from '../utils/password';
import { validatePasswordPolicy } from '../validations/password.validation';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const adminName = env.adminName.trim();
  const adminEmail = env.adminEmail.trim().toLowerCase();
  const adminPassword = env.adminPassword;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios para ejecutar el seed');
  }
  if (!validateEmail(adminEmail)) {
    throw new Error('ADMIN_EMAIL no tiene formato válido');
  }
  const passwordError = validatePasswordPolicy(adminPassword);
  if (passwordError) {
    throw new Error(`ADMIN_PASSWORD inválido: ${passwordError}`);
  }

  const [admin, created] = await User.findOrCreate({
    where: { email: adminEmail },
    defaults: {
      name: adminName,
      email: adminEmail,
      password: await hashPassword(adminPassword),
      roleId: adminRole.id,
      status: 'activo'
    }
  });

  if (!created) {
    const shouldRevoke = admin.roleId !== adminRole.id || admin.status !== 'activo';
    await admin.update({
      roleId: adminRole.id,
      status: 'activo',
      ...(shouldRevoke ? { tokenVersion: admin.tokenVersion + 1 } : {})
    });
    console.log('Usuario administrador existente verificado. La contraseña no fue modificada.');
  } else {
    console.log('Usuario administrador inicial creado desde variables de entorno.');
  }

  console.log('Seed inicial aplicado.');
  await sequelize.close();
};

seed().catch((error) => {
  console.error('Error ejecutando seed');
  console.error(error instanceof Error ? error.message : 'Error desconocido');
  process.exit(1);
});

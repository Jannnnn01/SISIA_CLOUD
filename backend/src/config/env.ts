import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Variable de entorno faltante: ${key}`);
    }
    console.warn(`Variable de entorno faltante: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10)
};

try {
  new URL(env.frontendUrl);
} catch {
  if (env.nodeEnv === 'production') {
    throw new Error('FRONTEND_URL no tiene formato de URL válido');
  }
  console.warn('FRONTEND_URL no tiene formato de URL válido');
}

if (env.nodeEnv === 'production' && env.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción');
}

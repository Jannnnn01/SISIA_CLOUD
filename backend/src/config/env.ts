import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
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

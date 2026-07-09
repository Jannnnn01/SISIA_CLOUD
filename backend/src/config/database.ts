import { Sequelize } from 'sequelize';
import { newDb } from 'pg-mem';
import { env, useEmbeddedDatabase } from './env';

const embeddedDatabase = useEmbeddedDatabase ? newDb() : null;
const dialectModule = embeddedDatabase?.adapters.createPg();

export const sequelize = new Sequelize(
  env.databaseUrl || 'postgres://sisia:sisia@localhost:5432/sisia',
  {
  dialect: 'postgres',
  dialectModule,
  logging: env.nodeEnv === 'development' ? false : false,
  dialectOptions:
    env.nodeEnv === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
  }
);

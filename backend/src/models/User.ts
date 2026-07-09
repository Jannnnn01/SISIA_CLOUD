import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type UserStatus = 'activo' | 'inactivo';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  status: UserStatus;
  tokenVersion: number;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'status' | 'tokenVersion'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public status!: UserStatus;
  public tokenVersion!: number;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING(255), allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('activo', 'inactivo'), allowNull: false, defaultValue: 'activo' },
    tokenVersion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    defaultScope: { attributes: { exclude: ['password', 'tokenVersion'] } },
    scopes: { withPassword: { attributes: { include: ['password', 'tokenVersion'] } } }
  }
);

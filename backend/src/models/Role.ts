import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RoleAttributes {
  id: number;
  name: string;
  description: string | null;
}

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'description'>;

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
}

Role.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255), allowNull: true }
  },
  { sequelize, tableName: 'roles', timestamps: true }
);

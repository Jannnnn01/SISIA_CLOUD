import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ControlAttributes {
  id: number;
  riskId: number;
  name: string;
  description: string | null;
  type: string;
  status: string;
}

type ControlCreationAttributes = Optional<ControlAttributes, 'id' | 'description' | 'status'>;

export class Control extends Model<ControlAttributes, ControlCreationAttributes> implements ControlAttributes {
  public id!: number;
  public riskId!: number;
  public name!: string;
  public description!: string | null;
  public type!: string;
  public status!: string;
}

Control.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    riskId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(140), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING(60), allowNull: false },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'activo' }
  },
  { sequelize, tableName: 'controls', timestamps: true }
);

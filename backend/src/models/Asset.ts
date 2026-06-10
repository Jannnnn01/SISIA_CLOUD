import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AssetAttributes {
  id: number;
  name: string;
  type: string;
  description: string | null;
  owner: string;
  confidentialityLevel: string;
  integrityLevel: string;
  availabilityLevel: string;
  status: string;
}

type AssetCreationAttributes = Optional<AssetAttributes, 'id' | 'description' | 'status'>;

export class Asset extends Model<AssetAttributes, AssetCreationAttributes> implements AssetAttributes {
  public id!: number;
  public name!: string;
  public type!: string;
  public description!: string | null;
  public owner!: string;
  public confidentialityLevel!: string;
  public integrityLevel!: string;
  public availabilityLevel!: string;
  public status!: string;
}

Asset.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(140), allowNull: false },
    type: { type: DataTypes.STRING(80), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    owner: { type: DataTypes.STRING(120), allowNull: false },
    confidentialityLevel: { type: DataTypes.STRING(30), allowNull: false },
    integrityLevel: { type: DataTypes.STRING(30), allowNull: false },
    availabilityLevel: { type: DataTypes.STRING(30), allowNull: false },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'activo' }
  },
  { sequelize, tableName: 'assets', timestamps: true }
);

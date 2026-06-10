import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RiskAttributes {
  id: number;
  assetId: number;
  threat: string;
  vulnerability: string;
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: string;
  mitigationPlan: string | null;
  status: string;
}

type RiskCreationAttributes = Optional<RiskAttributes, 'id' | 'mitigationPlan' | 'status'>;

export class Risk extends Model<RiskAttributes, RiskCreationAttributes> implements RiskAttributes {
  public id!: number;
  public assetId!: number;
  public threat!: string;
  public vulnerability!: string;
  public probability!: number;
  public impact!: number;
  public riskScore!: number;
  public riskLevel!: string;
  public mitigationPlan!: string | null;
  public status!: string;
}

Risk.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    assetId: { type: DataTypes.INTEGER, allowNull: false },
    threat: { type: DataTypes.STRING(160), allowNull: false },
    vulnerability: { type: DataTypes.STRING(160), allowNull: false },
    probability: { type: DataTypes.INTEGER, allowNull: false },
    impact: { type: DataTypes.INTEGER, allowNull: false },
    riskScore: { type: DataTypes.INTEGER, allowNull: false },
    riskLevel: { type: DataTypes.STRING(30), allowNull: false },
    mitigationPlan: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'activo' }
  },
  { sequelize, tableName: 'risks', timestamps: true }
);

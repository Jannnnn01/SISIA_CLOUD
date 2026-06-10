import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AuditLogAttributes {
  id: number;
  userId: number | null;
  action: string;
  module: string;
  recordId: number | null;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt?: Date;
}

type AuditLogCreationAttributes = Optional<AuditLogAttributes, 'id' | 'userId' | 'recordId' | 'ipAddress' | 'userAgent' | 'createdAt'>;

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: number;
  public userId!: number | null;
  public action!: string;
  public module!: string;
  public recordId!: number | null;
  public description!: string;
  public ipAddress!: string | null;
  public userAgent!: string | null;
}

AuditLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING(80), allowNull: false },
    module: { type: DataTypes.STRING(80), allowNull: false },
    recordId: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.STRING(255), allowNull: false },
    ipAddress: { type: DataTypes.STRING(80), allowNull: true },
    userAgent: { type: DataTypes.STRING(255), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: 'audit_logs', updatedAt: false }
);

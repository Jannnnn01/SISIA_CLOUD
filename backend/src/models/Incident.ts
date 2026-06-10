import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type IncidentStatus = 'pendiente' | 'en_proceso' | 'cerrado' | 'inactivo';

export interface IncidentAttributes {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: IncidentStatus;
  createdById: number;
  assignedToId: number | null;
  technicalObservation: string | null;
  closedAt: Date | null;
}

type IncidentCreationAttributes = Optional<IncidentAttributes, 'id' | 'status' | 'assignedToId' | 'technicalObservation' | 'closedAt'>;

export class Incident extends Model<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public priority!: string;
  public status!: IncidentStatus;
  public createdById!: number;
  public assignedToId!: number | null;
  public technicalObservation!: string | null;
  public closedAt!: Date | null;
}

Incident.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(160), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING(80), allowNull: false },
    priority: { type: DataTypes.STRING(30), allowNull: false },
    status: { type: DataTypes.ENUM('pendiente', 'en_proceso', 'cerrado', 'inactivo'), allowNull: false, defaultValue: 'pendiente' },
    createdById: { type: DataTypes.INTEGER, allowNull: false },
    assignedToId: { type: DataTypes.INTEGER, allowNull: true },
    technicalObservation: { type: DataTypes.TEXT, allowNull: true },
    closedAt: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, tableName: 'incidents', timestamps: true }
);

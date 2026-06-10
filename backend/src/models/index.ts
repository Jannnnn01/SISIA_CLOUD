import { Role } from './Role';
import { User } from './User';
import { Incident } from './Incident';
import { Asset } from './Asset';
import { Risk } from './Risk';
import { Control } from './Control';
import { AuditLog } from './AuditLog';

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

User.hasMany(Incident, { foreignKey: 'createdById', as: 'createdIncidents' });
User.hasMany(Incident, { foreignKey: 'assignedToId', as: 'assignedIncidents' });
Incident.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
Incident.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

Asset.hasMany(Risk, { foreignKey: 'assetId', as: 'risks' });
Risk.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Risk.hasMany(Control, { foreignKey: 'riskId', as: 'controls' });
Control.belongsTo(Risk, { foreignKey: 'riskId', as: 'risk' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Role, User, Incident, Asset, Risk, Control, AuditLog };

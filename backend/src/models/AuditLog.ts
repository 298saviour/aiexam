import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export enum AuditActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SUSPEND = 'suspend',
  REACTIVATE = 'reactivate',
}

export interface AuditLogAttributes {
  id: number;
  userId: number;
  actionType: AuditActionType;
  targetType: string; // e.g., 'user', 'exam', 'class'
  targetId: number;
  changes?: object;
  createdAt?: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'changes' | 'createdAt'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  declare id: number;
  declare userId: number;
  declare actionType: AuditActionType;
  declare targetType: string;
  declare targetId: number;
  declare changes?: object;
  declare readonly createdAt: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    actionType: {
      type: DataTypes.ENUM(...Object.values(AuditActionType)),
      allowNull: false,
    },
    targetType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['targetType', 'targetId'] },
      { fields: ['createdAt'] },
    ],
  }
);

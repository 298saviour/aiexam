import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

interface SystemLogAttributes {
  id: string;
  action: string;
  actorRole: 'admin' | 'teacher' | 'student';
  actorId: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

interface SystemLogCreationAttributes extends Optional<SystemLogAttributes, 'id' | 'timestamp' | 'metadata'> {}

export class SystemLog extends Model<SystemLogAttributes, SystemLogCreationAttributes> implements SystemLogAttributes {
  public id!: string;
  public action!: string;
  public actorRole!: 'admin' | 'teacher' | 'student';
  public actorId!: string;
  public description!: string;
  public metadata?: Record<string, any>;
  public timestamp!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SystemLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Action type: user_created, exam_uploaded, course_created, etc.',
    },
    actorRole: {
      type: DataTypes.ENUM('admin', 'teacher', 'student'),
      allowNull: false,
    },
    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional context data',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'system_logs',
    timestamps: true,
    indexes: [
      { fields: ['action'] },
      { fields: ['actorRole'] },
      { fields: ['actorId'] },
      { fields: ['timestamp'] },
    ],
  }
);

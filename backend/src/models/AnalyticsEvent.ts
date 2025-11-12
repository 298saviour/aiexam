import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

interface AnalyticsEventAttributes {
  id: string;
  eventName: string;
  eventType: 'visit' | 'contact_form' | 'signup' | 'login' | 'exam_taken' | 'course_view' | 'cta_click';
  userAgent?: string;
  ip?: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

interface AnalyticsEventCreationAttributes extends Optional<AnalyticsEventAttributes, 'id' | 'timestamp' | 'userAgent' | 'ip' | 'userId' | 'metadata'> {}

export class AnalyticsEvent extends Model<AnalyticsEventAttributes, AnalyticsEventCreationAttributes> implements AnalyticsEventAttributes {
  public id!: string;
  public eventName!: string;
  public eventType!: 'visit' | 'contact_form' | 'signup' | 'login' | 'exam_taken' | 'course_view' | 'cta_click';
  public userAgent?: string;
  public ip?: string;
  public userId?: string;
  public metadata?: Record<string, any>;
  public timestamp!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AnalyticsEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventType: {
      type: DataTypes.ENUM('visit', 'contact_form', 'signup', 'login', 'exam_taken', 'course_view', 'cta_click'),
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'analytics_events',
    timestamps: true,
    indexes: [
      { fields: ['eventType'] },
      { fields: ['userId'] },
      { fields: ['timestamp'] },
      { fields: ['ip'] },
    ],
  }
);

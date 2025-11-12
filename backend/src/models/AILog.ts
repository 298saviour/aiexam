import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export enum AILogStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AILogActionType {
  TRAINING = 'training',
  GRADING = 'grading',
  PARSING = 'parsing',
}

export interface AILogAttributes {
  id: number;
  jobId: string;
  studentId?: number;
  teacherId?: number;
  courseId?: number;
  examId?: number;
  actionType: AILogActionType;
  status: AILogStatus;
  inputSummary?: string;
  outputSummary?: string;
  fullLog?: object;
  errorTrace?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AILogCreationAttributes extends Optional<AILogAttributes, 'id' | 'studentId' | 'teacherId' | 'courseId' | 'examId' | 'inputSummary' | 'outputSummary' | 'fullLog' | 'errorTrace' | 'createdAt' | 'updatedAt'> {}

export class AILog extends Model<AILogAttributes, AILogCreationAttributes> implements AILogAttributes {
  declare id: number;
  declare jobId: string;
  declare studentId?: number;
  declare teacherId?: number;
  declare courseId?: number;
  declare examId?: number;
  declare actionType: AILogActionType;
  declare status: AILogStatus;
  declare inputSummary?: string;
  declare outputSummary?: string;
  declare fullLog?: object;
  declare errorTrace?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AILog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actionType: {
      type: DataTypes.ENUM(...Object.values(AILogActionType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AILogStatus)),
      allowNull: false,
      defaultValue: AILogStatus.PENDING,
    },
    inputSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    outputSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullLog: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    errorTrace: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ai_logs',
    timestamps: true,
    indexes: [
      { fields: ['jobId'], unique: true },
      { fields: ['status'] },
      { fields: ['actionType'] },
      { fields: ['createdAt'] },
    ],
  }
);

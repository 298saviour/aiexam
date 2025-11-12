import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface PerformanceHistoryAttributes {
  id: number;
  studentId: number;
  courseId: number;
  examId: number;
  score: number;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PerformanceHistoryCreationAttributes extends Optional<PerformanceHistoryAttributes, 'id' | 'remark' | 'createdAt' | 'updatedAt'> {}

export class PerformanceHistory extends Model<PerformanceHistoryAttributes, PerformanceHistoryCreationAttributes> implements PerformanceHistoryAttributes {
  declare id: number;
  declare studentId: number;
  declare courseId: number;
  declare examId: number;
  declare score: number;
  declare remark?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PerformanceHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exams',
        key: 'id',
      },
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'performance_history',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['courseId'] },
      { fields: ['examId'] },
    ],
  }
);

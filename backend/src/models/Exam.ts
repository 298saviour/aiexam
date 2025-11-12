import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export enum ExamType {
  MCQ = 'mcq',
  WRITTEN = 'written',
  MIXED = 'mixed',
}

export interface ExamAttributes {
  id: number;
  courseId: number;
  title: string;
  type: ExamType;
  duration: number; // in minutes
  availableFrom?: Date;
  availableUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExamCreationAttributes extends Optional<ExamAttributes, 'id' | 'availableFrom' | 'availableUntil' | 'createdAt' | 'updatedAt'> {}

export class Exam extends Model<ExamAttributes, ExamCreationAttributes> implements ExamAttributes {
  declare id: number;
  declare courseId: number;
  declare title: string;
  declare type: ExamType;
  declare duration: number;
  declare availableFrom?: Date;
  declare availableUntil?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Exam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ExamType)),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    availableUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'exams',
    timestamps: true,
    indexes: [
      { fields: ['courseId'] },
      { fields: ['availableFrom', 'availableUntil'] },
    ],
  }
);

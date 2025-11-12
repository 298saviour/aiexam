import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface StudentExamAttributes {
  id: number;
  studentId: number;
  examId: number;
  answers: object; // JSON
  score?: number;
  aiRemarks?: string;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentExamCreationAttributes extends Optional<StudentExamAttributes, 'id' | 'score' | 'aiRemarks' | 'submittedAt' | 'createdAt' | 'updatedAt'> {}

export class StudentExam extends Model<StudentExamAttributes, StudentExamCreationAttributes> implements StudentExamAttributes {
  declare id: number;
  declare studentId: number;
  declare examId: number;
  declare answers: object;
  declare score?: number;
  declare aiRemarks?: string;
  declare submittedAt?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StudentExam.init(
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
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exams',
        key: 'id',
      },
    },
    answers: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    aiRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'student_exams',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'examId'], unique: true },
      { fields: ['examId'] },
    ],
  }
);

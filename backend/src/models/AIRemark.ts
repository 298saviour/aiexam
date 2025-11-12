import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface AIRemarkAttributes {
  id: number;
  studentExamId: number;
  courseId: number;
  score: number;
  remark: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AIRemarkCreationAttributes extends Optional<AIRemarkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class AIRemark extends Model<AIRemarkAttributes, AIRemarkCreationAttributes> implements AIRemarkAttributes {
  declare id: number;
  declare studentExamId: number;
  declare courseId: number;
  declare score: number;
  declare remark: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AIRemark.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentExamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'student_exams',
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
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ai_remarks',
    timestamps: true,
    indexes: [
      { fields: ['studentExamId'] },
      { fields: ['courseId'] },
    ],
  }
);

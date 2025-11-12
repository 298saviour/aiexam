import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface QuestionAttributes {
  id: number;
  examId: number;
  questionText: string;
  options?: object; // JSON for MCQ options
  answerKey?: string;
  wordLimit?: number;
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id' | 'options' | 'answerKey' | 'wordLimit' | 'createdAt' | 'updatedAt'> {}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  declare id: number;
  declare examId: number;
  declare questionText: string;
  declare options?: object;
  declare answerKey?: string;
  declare wordLimit?: number;
  declare points: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exams',
        key: 'id',
      },
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    answerKey: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wordLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'questions',
    timestamps: true,
    indexes: [{ fields: ['examId'] }],
  }
);

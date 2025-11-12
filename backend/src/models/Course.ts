import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface CourseAttributes {
  id: number;
  name: string;
  teacherId: number;
  classId: number;
  lessonNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'lessonNotes' | 'createdAt' | 'updatedAt'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare id: number;
  declare name: string;
  declare teacherId: number;
  declare classId: number;
  declare lessonNotes?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id',
      },
    },
    lessonNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true,
    indexes: [
      { fields: ['teacherId'] },
      { fields: ['classId'] },
    ],
  }
);

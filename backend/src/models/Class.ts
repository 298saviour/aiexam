import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface ClassAttributes {
  id: number;
  name: string;
  teacherId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassCreationAttributes extends Optional<ClassAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  declare id: number;
  declare name: string;
  declare teacherId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Class.init(
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
  },
  {
    sequelize,
    tableName: 'classes',
    timestamps: true,
    indexes: [{ fields: ['teacherId'] }],
  }
);

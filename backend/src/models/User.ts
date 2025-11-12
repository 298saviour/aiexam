import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface UserAttributes {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  classId?: number;
  suspended: boolean;
  // Student fields
  guardianName?: string;
  guardianEmail?: string;
  address?: string;
  // Teacher fields
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'suspended' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare role: UserRole;
  declare name: string;
  declare email: string;
  declare password: string;
  declare profilePhoto?: string;
  declare classId?: number;
  declare suspended: boolean;
  declare guardianName?: string;
  declare guardianEmail?: string;
  declare address?: string;
  declare phone?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profilePhoto: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'classes',
        key: 'id',
      },
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    guardianName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    guardianEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['role'] },
      { fields: ['classId'] },
      { fields: ['suspended'] },
    ],
  }
);

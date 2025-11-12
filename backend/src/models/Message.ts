import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

interface MessageAttributes {
  id: number;
  senderId: number;
  recipientId: number;
  subject: string;
  body: string;
  read: boolean;
  attachments?: string; // JSON string of attachment metadata
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'read' | 'attachments'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public senderId!: number;
  public recipientId!: number;
  public subject!: string;
  public body!: string;
  public read!: boolean;
  public attachments?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attachments: {
      type: DataTypes.TEXT, // Store as JSON string
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    indexes: [
      {
        fields: ['senderId'],
      },
      {
        fields: ['recipientId'],
      },
      {
        fields: ['read'],
      },
    ],
  }
);

export default Message;

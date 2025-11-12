import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { logger } from '../config/logger';

// Create sequelize instance
const sequelize = new Sequelize({
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error({ error }, 'Unable to connect to database');
    throw error;
  }
};

// Export sequelize instance
export { sequelize };

// Export models - loaded after sequelize is defined
export * from './User';
export * from './Class';
export * from './Course';
export * from './Exam';
export * from './Question';
export * from './StudentExam';
export * from './AIRemark';
export * from './PerformanceHistory';
export * from './AILog';
export * from './AuditLog';

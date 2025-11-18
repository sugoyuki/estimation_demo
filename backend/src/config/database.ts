import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// データベース接続設定
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'calibration_system',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// データベース接続テスト
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');
    return true;
  } catch (error) {
    const err = error as Error;
    console.error('✗ Unable to connect to the database:', err.message);
    return false;
  }
};

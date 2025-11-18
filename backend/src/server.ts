import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import { testConnection } from './config/database';

// ルートのインポート
import servicesRoutes from './routes/services';
import rulesGeneralRoutes from './routes/rulesGeneral';
import rulesForceRoutes from './routes/rulesForce';
import calibrationRoutes from './routes/calibration';

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ヘルスチェック
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// APIルート
app.use('/api/services', servicesRoutes);
app.use('/api/rules/general', rulesGeneralRoutes);
app.use('/api/rules/force', rulesForceRoutes);
app.use('/api/calibration', calibrationRoutes);

// 404ハンドラ
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// エラーハンドラ
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// サーバー起動
const startServer = async (): Promise<void> => {
  try {
    // データベース接続確認
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  校正料金自動算出システム API Server      ║
╠════════════════════════════════════════════╣
║  Port: ${PORT.toString().padEnd(35)} ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)} ║
║  Status: Running                          ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

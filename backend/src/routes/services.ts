import express from 'express';
import * as servicesController from '../controllers/servicesController';

const router = express.Router();

// GET /api/services - 全サービス取得
router.get('/', servicesController.getAllServices);

// GET /api/services/:id - サービスIDで取得
router.get('/:id', servicesController.getServiceById);

// POST /api/services - サービス作成
router.post('/', servicesController.createService);

// PUT /api/services/:id - サービス更新
router.put('/:id', servicesController.updateService);

// DELETE /api/services/:id - サービス削除（論理削除）
router.delete('/:id', servicesController.deleteService);

// DELETE /api/services/:id/hard - サービス物理削除（開発用）
router.delete('/:id/hard', servicesController.hardDeleteService);

export default router;

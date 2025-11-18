import express from 'express';
import * as calibrationController from '../controllers/calibrationController';

const router = express.Router();

// 見積管理
router.get('/requests', calibrationController.getAllRequests);
router.get('/requests/:id', calibrationController.getRequestById);
router.post('/requests', calibrationController.createRequest);
router.put('/requests/:id', calibrationController.updateRequest);
router.delete('/requests/:id', calibrationController.deleteRequest);

// 見積明細管理
router.post('/requests/:id/items', calibrationController.addItem);
router.put('/requests/:id/items/:itemId', calibrationController.updateItem);
router.delete('/requests/:id/items/:itemId', calibrationController.deleteItem);

export default router;

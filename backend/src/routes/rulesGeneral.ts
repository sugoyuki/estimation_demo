import express from 'express';
import * as rulesGeneralController from '../controllers/rulesGeneralController';

const router = express.Router();

// GET /api/rules/general - 全ルール取得
router.get('/', rulesGeneralController.getAllRules);

// GET /api/rules/general/:id - ルールIDで取得
router.get('/:id', rulesGeneralController.getRuleById);

// POST /api/rules/general - ルール作成
router.post('/', rulesGeneralController.createRule);

// PUT /api/rules/general/:id - ルール更新
router.put('/:id', rulesGeneralController.updateRule);

// DELETE /api/rules/general/:id - ルール削除（論理削除）
router.delete('/:id', rulesGeneralController.deleteRule);

export default router;

const express = require('express');
const router = express.Router();
const rulesForceController = require('../controllers/rulesForceController');

// GET /api/rules/force - 全ルール取得
router.get('/', rulesForceController.getAllRules);

// GET /api/rules/force/:id - ルールIDで取得
router.get('/:id', rulesForceController.getRuleById);

// POST /api/rules/force - ルール作成
router.post('/', rulesForceController.createRule);

// PUT /api/rules/force/:id - ルール更新
router.put('/:id', rulesForceController.updateRule);

// DELETE /api/rules/force/:id - ルール削除（論理削除）
router.delete('/:id', rulesForceController.deleteRule);

module.exports = router;

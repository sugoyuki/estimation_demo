const { MRuleGeneral, MService } = require('../models');
const { Op } = require('sequelize');

// 全ルール取得
const getAllRules = async (req, res) => {
  try {
    const { service_id, is_active } = req.query;
    const where = {};

    if (service_id) where.service_id = service_id;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const rules = await MRuleGeneral.findAll({
      where,
      include: [{ model: MService, as: 'service' }],
      order: [['service_id', 'ASC'], ['range1_min', 'ASC']]
    });

    res.json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    console.error('Error in getAllRules:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ルールIDで取得
const getRuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const rule = await MRuleGeneral.findByPk(id, {
      include: [{ model: MService, as: 'service' }]
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    console.error('Error in getRuleById:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ルール作成
const createRule = async (req, res) => {
  try {
    const {
      service_id,
      field_cd,
      resolution,
      range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit,
      range1_min_included, range1_max_included,
      range2_name, range2_min, range2_max, range2_min_unit, range2_max_unit,
      range2_min_included, range2_max_included,
      point_fee,
      is_active
    } = req.body;

    // 必須フィールド検証
    if (!service_id || point_fee === undefined) {
      return res.status(400).json({
        success: false,
        error: 'service_id and point_fee are required'
      });
    }

    // サービス存在確認
    const service = await MService.findByPk(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    const newRule = await MRuleGeneral.create({
      service_id,
      field_cd,
      resolution,
      range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit,
      range1_min_included: range1_min_included !== undefined ? range1_min_included : true,
      range1_max_included: range1_max_included !== undefined ? range1_max_included : true,
      range2_name, range2_min, range2_max, range2_min_unit, range2_max_unit,
      range2_min_included: range2_min_included !== undefined ? range2_min_included : true,
      range2_max_included: range2_max_included !== undefined ? range2_max_included : true,
      point_fee,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      success: true,
      data: newRule
    });
  } catch (error) {
    console.error('Error in createRule:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ルール更新
const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rule = await MRuleGeneral.findByPk(id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }

    await rule.update(updates);

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    console.error('Error in updateRule:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ルール削除（論理削除）
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    const rule = await MRuleGeneral.findByPk(id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }

    await rule.update({ is_active: false });

    res.json({
      success: true,
      message: 'Rule deactivated successfully'
    });
  } catch (error) {
    console.error('Error in deleteRule:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule
};

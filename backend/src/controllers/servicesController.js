const { MService, MRuleGeneral, MRuleForce } = require('../models');
const { Op } = require('sequelize');

// 全サービス取得
const getAllServices = async (req, res) => {
  try {
    const { field, is_active } = req.query;
    const where = {};

    if (field) where.field = field;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const services = await MService.findAll({
      where,
      include: [
        { model: MRuleGeneral, as: 'generalRules' },
        { model: MRuleForce, as: 'forceRules' }
      ],
      order: [['service_id', 'ASC']]
    });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error in getAllServices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// サービスIDで取得
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await MService.findByPk(id, {
      include: [
        { model: MRuleGeneral, as: 'generalRules', where: { is_active: true }, required: false },
        { model: MRuleForce, as: 'forceRules', where: { is_active: true }, required: false }
      ]
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error in getServiceById:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// サービス作成
const createService = async (req, res) => {
  try {
    const {
      revenue_category, field, equipment_name, equipment_type1, equipment_type2,
      combination, main_option, option_name, calibration_item, method,
      base_fee, requires_point_calc, is_active
    } = req.body;

    // 必須フィールド検証
    if (!equipment_name || !field) {
      return res.status(400).json({
        success: false,
        error: 'equipment_name and field are required'
      });
    }

    const newService = await MService.create({
      revenue_category,
      field,
      equipment_name,
      equipment_type1,
      equipment_type2,
      combination,
      main_option,
      option_name,
      calibration_item,
      method,
      base_fee: base_fee || 0.00,
      requires_point_calc: requires_point_calc || false,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      success: true,
      data: newService
    });
  } catch (error) {
    console.error('Error in createService:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// サービス更新
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      revenue_category, field, equipment_name, equipment_type1, equipment_type2,
      combination, main_option, option_name, calibration_item, method,
      base_fee, requires_point_calc, is_active
    } = req.body;

    const service = await MService.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // 更新
    await service.update({
      ...(revenue_category !== undefined && { revenue_category }),
      ...(field && { field }),
      ...(equipment_name && { equipment_name }),
      ...(equipment_type1 !== undefined && { equipment_type1 }),
      ...(equipment_type2 !== undefined && { equipment_type2 }),
      ...(combination !== undefined && { combination }),
      ...(main_option !== undefined && { main_option }),
      ...(option_name !== undefined && { option_name }),
      ...(calibration_item !== undefined && { calibration_item }),
      ...(method !== undefined && { method }),
      ...(base_fee !== undefined && { base_fee }),
      ...(requires_point_calc !== undefined && { requires_point_calc }),
      ...(is_active !== undefined && { is_active })
    });

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error in updateService:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// サービス削除（論理削除）
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await MService.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // 論理削除（is_activeをfalseに）
    await service.update({ is_active: false });

    res.json({
      success: true,
      message: 'Service deactivated successfully'
    });
  } catch (error) {
    console.error('Error in deleteService:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 物理削除（開発用）
const hardDeleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await MService.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    await service.destroy();

    res.json({
      success: true,
      message: 'Service deleted permanently'
    });
  } catch (error) {
    console.error('Error in hardDeleteService:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  hardDeleteService
};

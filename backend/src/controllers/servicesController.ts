import { Request, Response } from 'express';
import { MField, MService, MRuleGeneral, MRuleForce } from '../models';

// 全サービス取得
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { field, is_active } = req.query;
    const where: any = {};

    if (field) where.field = field;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const services = await MService.findAll({
      where,
      include: [
        { model: MField, as: 'fieldInfo' },
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
    const err = error as Error;
    console.error('Error in getAllServices:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// サービスIDで取得
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await MService.findByPk(id, {
      include: [
        { model: MField, as: 'fieldInfo' },
        { model: MRuleGeneral, as: 'generalRules', where: { is_active: true }, required: false },
        { model: MRuleForce, as: 'forceRules', where: { is_active: true }, required: false }
      ]
    });

    if (!service) {
      res.status(404).json({
        success: false,
        error: 'Service not found'
      });
      return;
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in getServiceById:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// サービス作成
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      field_id, field_number, field, equipment_name, equipment_type1, equipment_type2,
      combination, main_option, option_name, calibration_item, method, is_active
    } = req.body;

    // 必須フィールド検証
    if (!field_id || !field_number || !equipment_name || !field) {
      res.status(400).json({
        success: false,
        error: 'field_id, field_number, equipment_name and field are required'
      });
      return;
    }

    const newService = await MService.create({
      field_id,
      field_number,
      field,
      equipment_name,
      equipment_type1,
      equipment_type2,
      combination,
      main_option,
      option_name,
      calibration_item,
      method,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      success: true,
      data: newService
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in createService:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// サービス更新
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      field_id, field_number, field, equipment_name, equipment_type1, equipment_type2,
      combination, main_option, option_name, calibration_item, method, is_active
    } = req.body;

    const service = await MService.findByPk(id);

    if (!service) {
      res.status(404).json({
        success: false,
        error: 'Service not found'
      });
      return;
    }

    // 更新
    await service.update({
      ...(field_id !== undefined && { field_id }),
      ...(field_number !== undefined && { field_number }),
      ...(field && { field }),
      ...(equipment_name && { equipment_name }),
      ...(equipment_type1 !== undefined && { equipment_type1 }),
      ...(equipment_type2 !== undefined && { equipment_type2 }),
      ...(combination !== undefined && { combination }),
      ...(main_option !== undefined && { main_option }),
      ...(option_name !== undefined && { option_name }),
      ...(calibration_item !== undefined && { calibration_item }),
      ...(method !== undefined && { method }),
      ...(is_active !== undefined && { is_active })
    });

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in updateService:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// サービス削除（論理削除）
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await MService.findByPk(id);

    if (!service) {
      res.status(404).json({
        success: false,
        error: 'Service not found'
      });
      return;
    }

    // 論理削除（is_activeをfalseに）
    await service.update({ is_active: false });

    res.json({
      success: true,
      message: 'Service deactivated successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in deleteService:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// 物理削除（開発用）
export const hardDeleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await MService.findByPk(id);

    if (!service) {
      res.status(404).json({
        success: false,
        error: 'Service not found'
      });
      return;
    }

    await service.destroy();

    res.json({
      success: true,
      message: 'Service deleted permanently'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in hardDeleteService:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

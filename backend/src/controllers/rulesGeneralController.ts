import { Request, Response } from 'express';
import { MRuleGeneral, MService } from '../models';

// 全ルール取得
export const getAllRules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service_id, is_active } = req.query;
    const where: any = {};

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
    const err = error as Error;
    console.error('Error in getAllRules:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ルールIDで取得
export const getRuleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const rule = await MRuleGeneral.findByPk(id, {
      include: [{ model: MService, as: 'service' }]
    });

    if (!rule) {
      res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
      return;
    }

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in getRuleById:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ルール作成
export const createRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      service_id,
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
      res.status(400).json({
        success: false,
        error: 'service_id and point_fee are required'
      });
      return;
    }

    // サービス存在確認
    const service = await MService.findByPk(service_id);
    if (!service) {
      res.status(404).json({
        success: false,
        error: 'Service not found'
      });
      return;
    }

    const newRule = await MRuleGeneral.create({
      service_id,
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
    const err = error as Error;
    console.error('Error in createRule:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ルール更新
export const updateRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rule = await MRuleGeneral.findByPk(id);

    if (!rule) {
      res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
      return;
    }

    await rule.update(updates);

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in updateRule:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ルール削除（論理削除）
export const deleteRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const rule = await MRuleGeneral.findByPk(id);

    if (!rule) {
      res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
      return;
    }

    await rule.update({ is_active: false });

    res.json({
      success: true,
      message: 'Rule deactivated successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in deleteRule:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

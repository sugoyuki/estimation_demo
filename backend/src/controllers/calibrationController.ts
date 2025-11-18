import { Request, Response } from 'express';
import { TCalibrationRequest, TCalibrationItem, MService } from '../models';
import { sequelize } from '../config/database';
import { Transaction, Op } from 'sequelize';
import { FeeCalculationInput } from '../types';
import * as feeCalculator from '../services/feeCalculator';

/**
 * 見積一覧取得
 */
export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, customer_name } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (customer_name) where.customer_name = { [Op.like]: `%${customer_name}%` };

    const requests = await TCalibrationRequest.findAll({
      where,
      include: [
        {
          model: TCalibrationItem,
          as: 'items',
          include: [{ model: MService, as: 'service' }]
        }
      ],
      order: [['request_date', 'DESC']]
    });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in getAllRequests:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 見積詳細取得
 */
export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await TCalibrationRequest.findByPk(id, {
      include: [
        {
          model: TCalibrationItem,
          as: 'items',
          include: [{ model: MService, as: 'service' }]
        }
      ]
    });

    if (!request) {
      res.status(404).json({
        success: false,
        error: 'Request not found'
      });
      return;
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in getRequestById:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 見積作成
 */
export const createRequest = async (req: Request, res: Response): Promise<void> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const { request_number, customer_name, request_date, notes, items } = req.body;

    // 必須フィールド検証
    if (!request_number || !customer_name || !request_date) {
      await t.rollback();
      res.status(400).json({
        success: false,
        error: 'request_number, customer_name, and request_date are required'
      });
      return;
    }

    // 見積作成
    const newRequest = await TCalibrationRequest.create(
      {
        request_number,
        customer_name,
        request_date,
        notes,
        status: 'draft',
        total_amount: 0
      },
      { transaction: t }
    );

    // 明細がある場合は追加
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await addItemToRequest(newRequest.request_id, item, t);
      }
    }

    // 合計金額を再計算
    await updateRequestTotal(newRequest.request_id, t);

    await t.commit();

    // 作成された見積を取得
    const result = await TCalibrationRequest.findByPk(newRequest.request_id, {
      include: [
        {
          model: TCalibrationItem,
          as: 'items',
          include: [{ model: MService, as: 'service' }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    await t.rollback();
    const err = error as Error;
    console.error('Error in createRequest:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 見積更新
 */
export const updateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { customer_name, request_date, status, notes } = req.body;

    const request = await TCalibrationRequest.findByPk(id);

    if (!request) {
      res.status(404).json({
        success: false,
        error: 'Request not found'
      });
      return;
    }

    await request.update({
      ...(customer_name && { customer_name }),
      ...(request_date && { request_date }),
      ...(status && { status }),
      ...(notes !== undefined && { notes })
    });

    const result = await TCalibrationRequest.findByPk(id, {
      include: [
        {
          model: TCalibrationItem,
          as: 'items',
          include: [{ model: MService, as: 'service' }]
        }
      ]
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in updateRequest:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 見積削除
 */
export const deleteRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await TCalibrationRequest.findByPk(id);

    if (!request) {
      res.status(404).json({
        success: false,
        error: 'Request not found'
      });
      return;
    }

    await request.destroy();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in deleteRequest:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 明細追加
 */
export const addItem = async (req: Request, res: Response): Promise<void> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const { id } = req.params; // request_id
    const itemData = req.body;

    const request = await TCalibrationRequest.findByPk(id);

    if (!request) {
      await t.rollback();
      res.status(404).json({
        success: false,
        error: 'Request not found'
      });
      return;
    }

    await addItemToRequest(Number(id), itemData, t);
    await updateRequestTotal(Number(id), t);

    await t.commit();

    const result = await TCalibrationRequest.findByPk(id, {
      include: [
        {
          model: TCalibrationItem,
          as: 'items',
          include: [{ model: MService, as: 'service' }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    await t.rollback();
    const err = error as Error;
    console.error('Error in addItem:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 明細更新
 */
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const { id, itemId } = req.params;
    const itemData = req.body;

    const item = await TCalibrationItem.findOne({
      where: {
        item_id: itemId,
        request_id: id
      }
    });

    if (!item) {
      await t.rollback();
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    // 料金再計算が必要な場合
    if (
      itemData.service_id ||
      itemData.point_count !== undefined ||
      itemData.range1_value !== undefined ||
      itemData.range2_value !== undefined ||
      itemData.force_range1_value !== undefined ||
      itemData.force_range2_value !== undefined ||
      itemData.quantity !== undefined
    ) {
      const calcData: FeeCalculationInput = {
        service_id: itemData.service_id || item.service_id,
        point_count: itemData.point_count !== undefined ? itemData.point_count : item.point_count,
        range1_value: itemData.range1_value !== undefined ? itemData.range1_value : item.range1_value,
        range2_value: itemData.range2_value !== undefined ? itemData.range2_value : item.range2_value,
        force_range1_value: itemData.force_range1_value !== undefined ? itemData.force_range1_value : item.force_range1_value,
        force_range2_value: itemData.force_range2_value !== undefined ? itemData.force_range2_value : item.force_range2_value,
        quantity: itemData.quantity || item.quantity
      };

      const feeResult = await feeCalculator.calculateFee(calcData);

      await item.update(
        {
          ...itemData,
          base_fee: feeResult.base_fee,
          point_fee: feeResult.point_fee,
          subtotal: feeResult.subtotal
        },
        { transaction: t }
      );
    } else {
      await item.update(itemData, { transaction: t });
    }

    await updateRequestTotal(Number(id), t);
    await t.commit();

    const result = await TCalibrationRequest.findByPk(id, {
      include: [
        {
          model: TCalibrationItem,
          as: 'items',
          include: [{ model: MService, as: 'service' }]
        }
      ]
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    await t.rollback();
    const err = error as Error;
    console.error('Error in updateItem:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * 明細削除
 */
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const { id, itemId } = req.params;

    const item = await TCalibrationItem.findOne({
      where: {
        item_id: itemId,
        request_id: id
      }
    });

    if (!item) {
      await t.rollback();
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    await item.destroy({ transaction: t });
    await updateRequestTotal(Number(id), t);

    await t.commit();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    const err = error as Error;
    console.error('Error in deleteItem:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * ヘルパー: 明細追加（料金自動計算付き）
 */
async function addItemToRequest(request_id: number, itemData: any, transaction: Transaction): Promise<any> {
  const {
    service_id,
    item_name,
    manufacturer,
    model_number,
    serial_number,
    quantity,
    point_count,
    range1_value,
    range2_value,
    force_range1_value,
    force_range2_value,
    notes
  } = itemData;

  if (!service_id || !item_name) {
    throw new Error('service_id and item_name are required');
  }

  // 料金計算
  const feeResult = await feeCalculator.calculateFee({
    service_id,
    point_count,
    range1_value,
    range2_value,
    force_range1_value,
    force_range2_value,
    quantity: quantity || 1
  });

  // 明細作成
  const newItem = await TCalibrationItem.create(
    {
      request_id,
      service_id,
      item_name,
      manufacturer,
      model_number,
      serial_number,
      quantity: quantity || 1,
      point_count,
      range1_value,
      range2_value,
      force_range1_value,
      force_range2_value,
      base_fee: feeResult.base_fee,
      point_fee: feeResult.point_fee,
      subtotal: feeResult.subtotal,
      notes
    },
    { transaction }
  );

  return newItem;
}

/**
 * ヘルパー: 見積合計金額更新
 */
async function updateRequestTotal(request_id: number, transaction: Transaction): Promise<void> {
  const items = await TCalibrationItem.findAll({
    where: { request_id },
    transaction
  });

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(String(item.subtotal || 0));
  }, 0);

  await TCalibrationRequest.update(
    { total_amount: total },
    { where: { request_id }, transaction }
  );
}

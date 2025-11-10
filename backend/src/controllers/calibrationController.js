const { TCalibrationRequest, TCalibrationItem, MService } = require('../models');
const { sequelize } = require('../config/database');
const feeCalculator = require('../services/feeCalculator');

/**
 * 見積一覧取得
 */
const getAllRequests = async (req, res) => {
  try {
    const { status, customer_name } = req.query;
    const where = {};

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
    console.error('Error in getAllRequests:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 見積詳細取得
 */
const getRequestById = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error in getRequestById:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 見積作成
 */
const createRequest = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { request_number, customer_name, request_date, notes, items } = req.body;

    // 必須フィールド検証
    if (!request_number || !customer_name || !request_date) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'request_number, customer_name, and request_date are required'
      });
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
    console.error('Error in createRequest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 見積更新
 */
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, request_date, status, notes } = req.body;

    const request = await TCalibrationRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
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
    console.error('Error in updateRequest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 見積削除
 */
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await TCalibrationRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    await request.destroy();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRequest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 明細追加
 */
const addItem = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params; // request_id
    const itemData = req.body;

    const request = await TCalibrationRequest.findByPk(id);

    if (!request) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    await addItemToRequest(id, itemData, t);
    await updateRequestTotal(id, t);

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
    console.error('Error in addItem:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 明細更新
 */
const updateItem = async (req, res) => {
  const t = await sequelize.transaction();

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
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
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
      const calcData = {
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

    await updateRequestTotal(id, t);
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
    console.error('Error in updateItem:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 明細削除
 */
const deleteItem = async (req, res) => {
  const t = await sequelize.transaction();

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
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    await item.destroy({ transaction: t });
    await updateRequestTotal(id, t);

    await t.commit();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error in deleteItem:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * ヘルパー: 明細追加（料金自動計算付き）
 */
async function addItemToRequest(request_id, itemData, transaction) {
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
async function updateRequestTotal(request_id, transaction) {
  const items = await TCalibrationItem.findAll({
    where: { request_id },
    transaction
  });

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.subtotal || 0);
  }, 0);

  await TCalibrationRequest.update(
    { total_amount: total },
    { where: { request_id }, transaction }
  );
}

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  addItem,
  updateItem,
  deleteItem
};

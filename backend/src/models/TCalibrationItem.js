const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TCalibrationItem = sequelize.define('TCalibrationItem', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 't_calibration_requests',
      key: 'request_id'
    }
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'm_services',
      key: 'service_id'
    }
  },
  item_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '校正品名'
  },
  manufacturer: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'メーカー'
  },
  model_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '型式'
  },
  serial_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'シリアル番号'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '数量'
  },
  point_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '点数'
  },
  // 一般分野用（範囲値）
  range1_value: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: true,
    comment: '範囲1の値'
  },
  range2_value: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: true,
    comment: '範囲2の値'
  },
  // 力学分野用
  force_range1_value: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: true,
    comment: '荷重などの値'
  },
  force_range2_value: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '荷重方向など'
  },
  // 算出料金
  base_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '基本料金'
  },
  point_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '点数料金'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '小計'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '備考'
  }
}, {
  tableName: 't_calibration_items',
  timestamps: true,
  underscored: true
});

module.exports = TCalibrationItem;

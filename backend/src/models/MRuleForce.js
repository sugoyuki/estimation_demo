const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MRuleForce = sequelize.define('MRuleForce', {
  rule_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'm_services',
      key: 'service_id'
    }
  },
  // 範囲1（荷重など）
  range1_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '範囲1名称（例：荷重）'
  },
  range1_min: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: true
  },
  range1_min_unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  range1_max: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: true
  },
  range1_max_unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  // 範囲2（荷重方向など）
  range2_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '範囲2名称（例：荷重方向）'
  },
  range2_value: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '範囲2（例：片方向、両方向、-）'
  },
  point_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '点数料金'
  },
  base_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '基本料金'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'm_rules_force',
  timestamps: true,
  underscored: true
});

module.exports = MRuleForce;

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { MRuleGeneralInstance } from '../types';

const MRuleGeneral = sequelize.define<MRuleGeneralInstance>('MRuleGeneral', {
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
  resolution: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '分解能'
  },
  // 範囲1
  range1_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '範囲1名称'
  },
  range1_min: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  range1_min_unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  range1_min_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '1=含む(>=)、0=含まない(>)'
  },
  range1_max: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  range1_max_unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  range1_max_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '1=含む(<=)、0=含まない(<)'
  },
  // 範囲2
  range2_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '範囲2名称'
  },
  range2_min: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  range2_min_unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  range2_min_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  range2_max: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  range2_max_unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  range2_max_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  point_fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '点数料金'
  },
  base_fee: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '基本料金'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'm_rules_general',
  timestamps: true,
  underscored: true
});;

export default MRuleGeneral;

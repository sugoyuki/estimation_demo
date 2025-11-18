import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { MServiceInstance } from '../types';

const MService = sequelize.define<MServiceInstance>('MService', {
  service_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  field_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'm_fields',
      key: 'field_id'
    },
    comment: '分野ID（m_fieldsへの参照）'
  },
  field_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '分野内番号'
  },
  field: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '分野（一般、力学）'
  },
  equipment_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '機器名'
  },
  equipment_type1: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '機器種類1'
  },
  equipment_type2: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '機器種類2'
  },
  combination: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '組み合わせ'
  },
  main_option: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'メイン・オプション'
  },
  option_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'オプション名'
  },
  calibration_item: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '校正項目'
  },
  method: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '手法'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'm_services',
  timestamps: true,
  underscored: true
});

export default MService;

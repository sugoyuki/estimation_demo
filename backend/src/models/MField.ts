import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { MFieldInstance } from '../types';

const MField = sequelize.define<MFieldInstance>('MField', {
  field_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  field_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '分野名（温度、湿度、体積、力、圧力、質量など）'
  },
  revenue_category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '収入区分（熱学、力学など）'
  },
  rule_table_type: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'ルールテーブル種別（general or force）'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'm_fields',
  timestamps: true,
  underscored: true
});

export default MField;

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { TCalibrationRequestInstance } from '../types';

const TCalibrationRequest = sequelize.define<TCalibrationRequestInstance>('TCalibrationRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  request_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  request_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'draft'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 't_calibration_requests',
  timestamps: true,
  underscored: true
});

export default TCalibrationRequest;

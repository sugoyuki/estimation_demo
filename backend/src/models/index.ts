import MField from './MField';
import MService from './MService';
import MRuleGeneral from './MRuleGeneral';
import MRuleForce from './MRuleForce';
import TCalibrationRequest from './TCalibrationRequest';
import TCalibrationItem from './TCalibrationItem';

// リレーション定義

// M_Fields と M_Services (1:多)
MField.hasMany(MService, {
  foreignKey: 'field_id',
  as: 'services'
});
MService.belongsTo(MField, {
  foreignKey: 'field_id',
  as: 'fieldInfo'
});

// M_Services と M_Rules_General (1:多)
MService.hasMany(MRuleGeneral, {
  foreignKey: 'service_id',
  as: 'generalRules'
});
MRuleGeneral.belongsTo(MService, {
  foreignKey: 'service_id',
  as: 'service'
});

// M_Services と M_Rules_Force (1:多)
MService.hasMany(MRuleForce, {
  foreignKey: 'service_id',
  as: 'forceRules'
});
MRuleForce.belongsTo(MService, {
  foreignKey: 'service_id',
  as: 'service'
});

// T_Calibration_Requests と T_Calibration_Items (1:多)
TCalibrationRequest.hasMany(TCalibrationItem, {
  foreignKey: 'request_id',
  as: 'items'
});
TCalibrationItem.belongsTo(TCalibrationRequest, {
  foreignKey: 'request_id',
  as: 'request'
});

// T_Calibration_Items と M_Services (多:1)
TCalibrationItem.belongsTo(MService, {
  foreignKey: 'service_id',
  as: 'service'
});
MService.hasMany(TCalibrationItem, {
  foreignKey: 'service_id',
  as: 'calibrationItems'
});

export {
  MField,
  MService,
  MRuleGeneral,
  MRuleForce,
  TCalibrationRequest,
  TCalibrationItem
};

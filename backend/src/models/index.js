const MService = require('./MService');
const MRuleGeneral = require('./MRuleGeneral');
const MRuleForce = require('./MRuleForce');
const TCalibrationRequest = require('./TCalibrationRequest');
const TCalibrationItem = require('./TCalibrationItem');

// リレーション定義

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

module.exports = {
  MService,
  MRuleGeneral,
  MRuleForce,
  TCalibrationRequest,
  TCalibrationItem
};

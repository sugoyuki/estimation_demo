import { Model, Optional } from 'sequelize';

// M_Fields
export interface MFieldAttributes {
  field_id: number;
  field_name: string;
  revenue_category: string;
  rule_table_type?: string;
  description?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface MFieldCreationAttributes
  extends Optional<MFieldAttributes, 'field_id' | 'created_at' | 'updated_at'> {}

export interface MFieldInstance
  extends Model<MFieldAttributes, MFieldCreationAttributes>,
    MFieldAttributes {}

// M_Services
export interface MServiceAttributes {
  service_id: number;
  field_id: number;
  field_number: number;
  field: string;
  equipment_name: string;
  equipment_type1?: string;
  equipment_type2?: string;
  combination?: string;
  main_option?: string;
  option_name?: string;
  calibration_item?: string;
  method?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface MServiceCreationAttributes
  extends Optional<MServiceAttributes, 'service_id' | 'created_at' | 'updated_at'> {}

export interface MServiceInstance
  extends Model<MServiceAttributes, MServiceCreationAttributes>,
    MServiceAttributes {}

// M_Rules_General
export interface MRuleGeneralAttributes {
  rule_id: number;
  service_id: number;
  resolution?: string;
  range1_name?: string;
  range1_min?: number;
  range1_min_unit?: string;
  range1_min_included: boolean;
  range1_max?: number;
  range1_max_unit?: string;
  range1_max_included: boolean;
  range2_name?: string;
  range2_min?: number;
  range2_min_unit?: string;
  range2_min_included: boolean;
  range2_max?: number;
  range2_max_unit?: string;
  range2_max_included: boolean;
  point_fee: number;
  base_fee?: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface MRuleGeneralCreationAttributes
  extends Optional<MRuleGeneralAttributes, 'rule_id' | 'created_at' | 'updated_at'> {}

export interface MRuleGeneralInstance
  extends Model<MRuleGeneralAttributes, MRuleGeneralCreationAttributes>,
    MRuleGeneralAttributes {}

// M_Rules_Force
export interface MRuleForceAttributes {
  rule_id: number;
  service_id: number;
  range1_name?: string;
  range1_min?: number;
  range1_min_unit?: string;
  range1_min_included: boolean;
  range1_max?: number;
  range1_max_unit?: string;
  range1_max_included: boolean;
  range2_name?: string;
  range2_value?: string;
  point_fee: number;
  base_fee: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface MRuleForceCreationAttributes
  extends Optional<MRuleForceAttributes, 'rule_id' | 'created_at' | 'updated_at'> {}

export interface MRuleForceInstance
  extends Model<MRuleForceAttributes, MRuleForceCreationAttributes>,
    MRuleForceAttributes {}

// T_Calibration_Requests
export interface TCalibrationRequestAttributes {
  request_id: number;
  request_number: string;
  customer_name: string;
  request_date: string;
  total_amount: number;
  status: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TCalibrationRequestCreationAttributes
  extends Optional<TCalibrationRequestAttributes, 'request_id' | 'created_at' | 'updated_at'> {}

export interface TCalibrationRequestInstance
  extends Model<TCalibrationRequestAttributes, TCalibrationRequestCreationAttributes>,
    TCalibrationRequestAttributes {}

// T_Calibration_Items
export interface TCalibrationItemAttributes {
  item_id: number;
  request_id: number;
  service_id: number;
  item_name: string;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  quantity: number;
  point_count?: number;
  range1_value?: number;
  range2_value?: number;
  force_range1_value?: number;
  force_range2_value?: string;
  base_fee: number;
  point_fee: number;
  subtotal: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TCalibrationItemCreationAttributes
  extends Optional<TCalibrationItemAttributes, 'item_id' | 'created_at' | 'updated_at'> {}

export interface TCalibrationItemInstance
  extends Model<TCalibrationItemAttributes, TCalibrationItemCreationAttributes>,
    TCalibrationItemAttributes {}

// Fee Calculation
export interface FeeCalculationInput {
  service_id: number;
  point_count?: number;
  range1_value?: number;
  range2_value?: number;
  force_range1_value?: number;
  force_range2_value?: string;
  quantity?: number;
}

export interface FeeCalculationResult {
  base_fee: number;
  point_fee: number;
  subtotal: number;
  calculation_details: {
    equipment_name?: string;
    field?: string;
    requires_point_calc?: boolean;
    rule_id?: number;
    resolution?: string;
    applied_range1?: string;
    applied_range2?: string;
    range1_name?: string;
    range2_name?: string;
    base_fee_value?: number;
    point_fee_unit?: number;
  };
}

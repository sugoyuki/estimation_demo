-- M_Rules_General に分野Cd を追加
UPDATE m_rules_general SET field_cd = '汎用001' WHERE rule_id = 1;
UPDATE m_rules_general SET field_cd = '汎用002' WHERE rule_id = 2;
UPDATE m_rules_general SET field_cd = '汎用003' WHERE rule_id = 3;
UPDATE m_rules_general SET field_cd = '汎用004' WHERE rule_id = 4;
UPDATE m_rules_general SET field_cd = '汎用005' WHERE rule_id = 5;
UPDATE m_rules_general SET field_cd = '汎用006' WHERE rule_id = 6;
UPDATE m_rules_general SET field_cd = '汎用007' WHERE rule_id = 7;

-- M_Rules_Force に分野Cd と境界値フラグを追加
UPDATE m_rules_force SET
  field_cd = '力1',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 1;

UPDATE m_rules_force SET
  field_cd = '力2',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 2;

UPDATE m_rules_force SET
  field_cd = '力3',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 3;

UPDATE m_rules_force SET
  field_cd = '力4',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 4;

UPDATE m_rules_force SET
  field_cd = '力5',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 5;

UPDATE m_rules_force SET
  field_cd = '力6',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 6;

UPDATE m_rules_force SET
  field_cd = '力7',
  range1_min_included = TRUE,
  range1_max_included = TRUE
WHERE rule_id = 7;

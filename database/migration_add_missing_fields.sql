-- M_Rules_General に分野Cdを追加
ALTER TABLE m_rules_general
ADD COLUMN field_cd VARCHAR(50);

COMMENT ON COLUMN m_rules_general.field_cd IS '分野コード（例：汎用001、汎用002）';

-- M_Rules_Force に分野Cdと境界値判定フラグを追加
ALTER TABLE m_rules_force
ADD COLUMN field_cd VARCHAR(50),
ADD COLUMN range1_min_included BOOLEAN DEFAULT TRUE,
ADD COLUMN range1_max_included BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN m_rules_force.field_cd IS '分野コード（例：力1、力2）';
COMMENT ON COLUMN m_rules_force.range1_min_included IS '範囲1最小値を含むか（1=含む(>=)、0=含まない(>)）';
COMMENT ON COLUMN m_rules_force.range1_max_included IS '範囲1最大値を含むか（1=含む(<=)、0=含まない(<)）';

-- インデックス追加
CREATE INDEX idx_rules_general_field_cd ON m_rules_general(field_cd);
CREATE INDEX idx_rules_force_field_cd ON m_rules_force(field_cd);

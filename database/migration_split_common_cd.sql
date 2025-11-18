-- 共通Cdを分野と番号に分割するマイグレーション

-- 1. m_servicesテーブル: 新しいカラムを追加
ALTER TABLE m_services
ADD COLUMN common_field VARCHAR(50),
ADD COLUMN common_number VARCHAR(50);

COMMENT ON COLUMN m_services.common_field IS '共通分野（例：熱学、力学）';
COMMENT ON COLUMN m_services.common_number IS '共通番号（例：001、012）';

-- 既存のcommon_cdデータを分割して新カラムに移行
-- 例: "熱学001" -> common_field="熱学", common_number="001"
UPDATE m_services
SET
  common_field = SUBSTRING(common_cd FROM 1 FOR LENGTH(common_cd) - 3),
  common_number = RIGHT(common_cd, 3)
WHERE common_cd IS NOT NULL;

-- 複合ユニーク制約を追加
ALTER TABLE m_services
ADD CONSTRAINT m_services_common_field_number_key UNIQUE (common_field, common_number);

-- インデックス追加
CREATE INDEX idx_services_common_field_number ON m_services(common_field, common_number);

-- 古いcommon_cdカラムとインデックスを削除
DROP INDEX IF EXISTS idx_services_common_cd;
ALTER TABLE m_services DROP CONSTRAINT IF EXISTS m_services_common_cd_key;
ALTER TABLE m_services DROP COLUMN IF EXISTS common_cd;


-- 2. m_rules_generalテーブル: 同様の変更
ALTER TABLE m_rules_general
ADD COLUMN common_field VARCHAR(50),
ADD COLUMN common_number VARCHAR(50);

COMMENT ON COLUMN m_rules_general.common_field IS '共通分野（例：熱学）';
COMMENT ON COLUMN m_rules_general.common_number IS '共通番号（例：001）';

-- 既存データの移行
UPDATE m_rules_general
SET
  common_field = SUBSTRING(common_cd FROM 1 FOR LENGTH(common_cd) - 3),
  common_number = RIGHT(common_cd, 3)
WHERE common_cd IS NOT NULL;

-- 外部キー制約を追加（common_fieldとcommon_numberの組み合わせでm_servicesを参照）
ALTER TABLE m_rules_general
ADD CONSTRAINT fk_rules_general_common
FOREIGN KEY (common_field, common_number)
REFERENCES m_services(common_field, common_number)
ON DELETE CASCADE;

-- 古いcommon_cdカラムを削除
ALTER TABLE m_rules_general DROP COLUMN IF EXISTS common_cd;


-- 3. m_rules_forceテーブル: 同様の変更
ALTER TABLE m_rules_force
ADD COLUMN common_field VARCHAR(50),
ADD COLUMN common_number VARCHAR(50);

COMMENT ON COLUMN m_rules_force.common_field IS '共通分野（例：力学）';
COMMENT ON COLUMN m_rules_force.common_number IS '共通番号（例：012）';

-- 既存データの移行
UPDATE m_rules_force
SET
  common_field = SUBSTRING(common_cd FROM 1 FOR LENGTH(common_cd) - 3),
  common_number = RIGHT(common_cd, 3)
WHERE common_cd IS NOT NULL;

-- 外部キー制約を追加
ALTER TABLE m_rules_force
ADD CONSTRAINT fk_rules_force_common
FOREIGN KEY (common_field, common_number)
REFERENCES m_services(common_field, common_number)
ON DELETE CASCADE;

-- 古いcommon_cdカラムを削除
ALTER TABLE m_rules_force DROP COLUMN IF EXISTS common_cd;


-- 確認クエリ
SELECT
  service_id,
  common_field,
  common_number,
  field,
  equipment_name
FROM m_services
ORDER BY common_field, common_number
LIMIT 10;

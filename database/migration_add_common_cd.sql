-- 共通Cd（common_cd）列を追加してExcelのリレーション構造を再現

-- 1. m_servicesテーブルに共通Cd列を追加
ALTER TABLE m_services
ADD COLUMN common_cd VARCHAR(50) UNIQUE;

COMMENT ON COLUMN m_services.common_cd IS '共通コード（例：熱学001、力学012）';

-- インデックス追加
CREATE INDEX idx_services_common_cd ON m_services(common_cd);

-- 2. m_rules_generalテーブルに共通Cd列を追加
ALTER TABLE m_rules_general
ADD COLUMN common_cd VARCHAR(50);

COMMENT ON COLUMN m_rules_general.common_cd IS '共通コード（m_servicesのcommon_cdと紐づく）';

-- 3. m_rules_forceテーブルに共通Cd列を追加
ALTER TABLE m_rules_force
ADD COLUMN common_cd VARCHAR(50);

COMMENT ON COLUMN m_rules_force.common_cd IS '共通コード（m_servicesのcommon_cdと紐づく）';

-- 4. 外部キー制約を追加（共通Cdベースのリレーション）
-- ※既存のservice_id外部キーは維持しつつ、common_cdでも紐づけられるようにする
-- 外部キー制約は後でデータ整合性が取れてから追加する方が安全

-- 確認
SELECT 'Migration completed: common_cd columns added' as status;

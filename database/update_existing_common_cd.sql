-- 既存データに共通Cd（common_cd）を設定

-- m_servicesの既存データに共通Cdを設定
-- service_id 1-10: 熱学001-010
-- service_id 11: 熱学010（熱電対）
-- service_id 12: 力学012（力計）

UPDATE m_services SET common_cd = '熱学001' WHERE service_id = 1;  -- ガラス製温度計
UPDATE m_services SET common_cd = '熱学002' WHERE service_id = 2;  -- 温度計
UPDATE m_services SET common_cd = '熱学003' WHERE service_id = 3;  -- 表面温度計
UPDATE m_services SET common_cd = '熱学010' WHERE service_id = 11; -- 熱電対
UPDATE m_services SET common_cd = '力学012' WHERE service_id = 12; -- 力計

-- m_rules_generalの既存データに共通Cdを設定
-- すべてservice_id=1（ガラス製温度計）なので、熱学001
UPDATE m_rules_general SET common_cd = '熱学001' WHERE service_id = 1;

-- m_rules_forceの既存データに共通Cdを設定
-- すべてservice_id=12（力計）なので、力学012
UPDATE m_rules_force SET common_cd = '力学012' WHERE service_id = 12;

-- 確認
SELECT 'Services with common_cd:' as info;
SELECT service_id, common_cd, equipment_name, field FROM m_services WHERE common_cd IS NOT NULL ORDER BY service_id;

SELECT 'General rules with common_cd:' as info;
SELECT rule_id, service_id, common_cd, field_cd FROM m_rules_general LIMIT 5;

SELECT 'Force rules with common_cd:' as info;
SELECT rule_id, service_id, common_cd, field_cd FROM m_rules_force LIMIT 5;

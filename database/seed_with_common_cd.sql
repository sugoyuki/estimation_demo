-- 共通Cd（common_cd）ベースのシードデータ
-- Excelの構造に準拠

-- 既存データをクリア
TRUNCATE TABLE t_calibration_items CASCADE;
TRUNCATE TABLE t_calibration_requests CASCADE;
TRUNCATE TABLE m_rules_force CASCADE;
TRUNCATE TABLE m_rules_general CASCADE;
TRUNCATE TABLE m_services CASCADE;

-- シーケンスをリセット
ALTER SEQUENCE m_services_service_id_seq RESTART WITH 1;
ALTER SEQUENCE m_rules_general_rule_id_seq RESTART WITH 1;
ALTER SEQUENCE m_rules_force_rule_id_seq RESTART WITH 1;

-- ==========================================
-- 1. サービスマスタ（共通）の投入
-- ==========================================
INSERT INTO m_services (common_cd, field, equipment_name, equipment_type1, combination, main_option, calibration_item, method, is_active) VALUES
-- 熱学系（一般分野で使用）
('熱学001', '一般', 'ガラス製温度計', NULL, '組み合わせ', 'メイン', '温度', NULL, true),
('熱学002', '一般', '温度計', NULL, '組み合わせ', 'メイン', '温度', NULL, true),
('熱学003', '一般', '表面温度計', NULL, '組み合わせ', 'メイン', '温度', NULL, true),
('熱学004', '一般', '放射温度計', NULL, '組み合わせ', 'メイン', '温度', NULL, true),
('熱学005', '一般', '赤外線サーモグラフィ', NULL, '組み合わせ', 'メイン', '温度', NULL, true),
('熱学006', '一般', '白金測温抵抗体', NULL, '組み合わせ', 'メイン', '温度', '比較校正', true),
('熱学007', '一般', '白金測温抵抗体', NULL, '組み合わせ', 'メイン', '温度', '定点測定 すず点', true),
('熱学008', '一般', '白金測温抵抗体', NULL, '組み合わせ', 'メイン', '温度', '定点測定 亜鉛点', true),
('熱学009', '一般', '白金測温抵抗体', NULL, '組み合わせ', 'メイン', '温度', '定点測定 アルミ点', true),
('熱学010', '一般', '熱電対', 'シース', 'センサ単体', 'メイン', '熱起電力', NULL, true),
('熱学011', '一般', '熱電対', 'シース', 'センサ単体', 'メイン', '熱起電力', NULL, true),
('熱学012', '一般', '熱電対', 'シース', 'センサ単体', 'メイン', '熱起電力', NULL, true),
('熱学013', '一般', '熱電対', 'シース', 'センサ単体', 'メイン', '熱起電力', NULL, true),
('熱学014', '一般', '熱電対', 'シース', 'センサ単体', 'メイン', '熱起電力', NULL, true),
('熱学015', '一般', '熱電対', 'シース', 'センサ単体', 'メイン', '熱起電力', NULL, true),

-- 力学系（力学分野で使用）
('力学012', '力学', '力計', '荷重', NULL, NULL, NULL, NULL, true),
('力学013', '力学', '力計', '荷重', NULL, NULL, NULL, NULL, true),
('力学014', '力学', '力計', '荷重', NULL, NULL, NULL, NULL, true),
('力学015', '力学', '力計', '荷重', NULL, NULL, NULL, NULL, true);

-- ==========================================
-- 2. 一般分野ルール（汎用）の投入
-- ==========================================
-- 熱学001（ガラス製温度計）のルール
INSERT INTO m_rules_general (service_id, common_cd, field_cd, resolution, range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit, range1_min_included, range1_max_included, point_fee, is_active)
SELECT
    s.service_id,
    '熱学001',
    '汎用001',
    '0.1℃以下',
    '温度',
    -100, 0, '℃', '℃',
    true, true,
    15, true
FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用002', '0.1℃以下', '温度', 0, 100, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用003', '0.1℃以下', '温度', 100, 200, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用004', '0.1℃以下', '温度', 200, 300, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用005', '0.1℃以下', '温度', 300, 500, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用006', '0.2℃以上', '温度', -100, 0, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用007', '0.2℃以上', '温度', 0, 100, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用008', '0.2℃以上', '温度', 100, 200, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用009', '0.2℃以上', '温度', 200, 300, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001'
UNION ALL
SELECT s.service_id, '熱学001', '汎用010', '0.2℃以上', '温度', 300, 500, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学001';

-- 熱学002（温度計）のルール
INSERT INTO m_rules_general (service_id, common_cd, field_cd, resolution, range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit, range1_min_included, range1_max_included, point_fee, is_active)
SELECT s.service_id, '熱学002', '汎用011', '-', '温度', -195.8, -195.8, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002'
UNION ALL
SELECT s.service_id, '熱学002', '汎用012', '0.01℃以下', '温度', -100, 0, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002'
UNION ALL
SELECT s.service_id, '熱学002', '汎用013', '0.01℃以下', '温度', 0, 100, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002'
UNION ALL
SELECT s.service_id, '熱学002', '汎用014', '0.01℃以下', '温度', 100, 250, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002'
UNION ALL
SELECT s.service_id, '熱学002', '汎用015', '0.01℃以下', '温度', 250, 500, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002'
UNION ALL
SELECT s.service_id, '熱学002', '汎用016', '0.01℃以下', '温度', 500, 1200, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002'
UNION ALL
SELECT s.service_id, '熱学002', '汎用017', '-', '温度', 1200, 1554, '℃', '℃', true, true, 15, true FROM m_services s WHERE s.common_cd = '熱学002';

-- ==========================================
-- 3. 力学分野ルール（力）の投入
-- ==========================================
-- 力学012（力計）のルール
INSERT INTO m_rules_force (service_id, common_cd, field_cd, range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit, range1_min_included, range1_max_included, range2_name, range2_value, point_fee, base_fee, is_active)
SELECT s.service_id, '力学012', '力1', '荷重', 0, 2, 'kN', 'kN', true, true, '荷重方向', '片方向', 4500, 39900, true FROM m_services s WHERE s.common_cd = '力学012'
UNION ALL
SELECT s.service_id, '力学012', '力2', '荷重', 2, 20, 'kN', 'kN', true, true, '荷重方向', '片方向', 4500, 44100, true FROM m_services s WHERE s.common_cd = '力学012'
UNION ALL
SELECT s.service_id, '力学012', '力3', '荷重', 20, 100, 'kN', 'kN', true, true, '荷重方向', '片方向', 5800, 57800, true FROM m_services s WHERE s.common_cd = '力学012'
UNION ALL
SELECT s.service_id, '力学012', '力4', '荷重', 0, 2, 'kN', 'kN', true, true, '荷重方向', '両方向', 4000, 79800, true FROM m_services s WHERE s.common_cd = '力学012'
UNION ALL
SELECT s.service_id, '力学012', '力5', '荷重', 2, 20, 'kN', 'kN', true, true, '荷重方向', '両方向', 4200, 88200, true FROM m_services s WHERE s.common_cd = '力学012'
UNION ALL
SELECT s.service_id, '力学012', '力6', '荷重', 20, 100, 'kN', 'kN', true, true, '荷重方向', '両方向', 5500, 115600, true FROM m_services s WHERE s.common_cd = '力学012';

-- 力学013のルール
INSERT INTO m_rules_force (service_id, common_cd, field_cd, range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit, range1_min_included, range1_max_included, range2_name, range2_value, point_fee, base_fee, is_active)
SELECT s.service_id, '力学013', '力7', '荷重', 0, 1, 'MN', 'MN', true, true, '荷重方向', '-', 6800, 67200, true FROM m_services s WHERE s.common_cd = '力学013'
UNION ALL
SELECT s.service_id, '力学013', '力8', '荷重', 2, 2, 'MN', 'MN', true, true, '荷重方向', '-', 10000, 99800, true FROM m_services s WHERE s.common_cd = '力学013'
UNION ALL
SELECT s.service_id, '力学013', '力9', '荷重', 20, 3, 'MN', 'MN', true, true, '荷重方向', '-', 11600, 116000, true FROM m_services s WHERE s.common_cd = '力学013';

-- 力学014のルール
INSERT INTO m_rules_force (service_id, common_cd, field_cd, range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit, range1_min_included, range1_max_included, range2_name, range2_value, point_fee, base_fee, is_active)
SELECT s.service_id, '力学014', '力10', '荷重', 0, 2, 'kN', 'kN', true, true, '荷重方向', '片方向', 13700, 137000, true FROM m_services s WHERE s.common_cd = '力学014'
UNION ALL
SELECT s.service_id, '力学014', '力11', '荷重', 2, 20, 'kN', 'kN', true, true, '荷重方向', '片方向', 0, 40000, true FROM m_services s WHERE s.common_cd = '力学014'
UNION ALL
SELECT s.service_id, '力学014', '力12', '荷重', 20, 100, 'kN', 'kN', true, true, '荷重方向', '片方向', 6500, 64800, true FROM m_services s WHERE s.common_cd = '力学014'
UNION ALL
SELECT s.service_id, '力学014', '力13', '荷重', 0, 2, 'kN', 'kN', true, true, '荷重方向', '両方向', 5400, 54000, true FROM m_services s WHERE s.common_cd = '力学014'
UNION ALL
SELECT s.service_id, '力学014', '力14', '荷重', 2, 20, 'kN', 'kN', true, true, '荷重方向', '両方向', 5900, 58400, true FROM m_services s WHERE s.common_cd = '力学014'
UNION ALL
SELECT s.service_id, '力学014', '力15', '荷重', 20, 100, 'kN', 'kN', true, true, '荷重方向', '両方向', 6500, 64800, true FROM m_services s WHERE s.common_cd = '力学014';

-- 力学015のルール
INSERT INTO m_rules_force (service_id, common_cd, field_cd, range1_name, range1_min, range1_max, range1_min_unit, range1_max_unit, range1_min_included, range1_max_included, range2_name, range2_value, point_fee, base_fee, is_active)
SELECT s.service_id, '力学015', '力16', '荷重', 0, 1, 'MN', 'MN', true, true, '荷重方向', '-', 8500, 84300, true FROM m_services s WHERE s.common_cd = '力学015'
UNION ALL
SELECT s.service_id, '力学015', '力17', '荷重', 2, 2, 'MN', 'MN', true, true, '荷重方向', '-', 13000, 130000, true FROM m_services s WHERE s.common_cd = '力学015'
UNION ALL
SELECT s.service_id, '力学015', '力18', '荷重', 20, 3, 'MN', 'MN', true, true, '荷重方向', '-', 3300, 32400, true FROM m_services s WHERE s.common_cd = '力学015';

-- 確認
SELECT 'Seed data inserted successfully' as status;
SELECT COUNT(*) as services_count FROM m_services;
SELECT COUNT(*) as general_rules_count FROM m_rules_general;
SELECT COUNT(*) as force_rules_count FROM m_rules_force;

-- リレーション確認
SELECT
    'General Rules Relation Check' as info,
    rg.field_cd,
    rg.common_cd,
    s.common_cd as service_common_cd,
    s.equipment_name
FROM m_rules_general rg
LEFT JOIN m_services s ON rg.common_cd = s.common_cd
LIMIT 5;

SELECT
    'Force Rules Relation Check' as info,
    rf.field_cd,
    rf.common_cd,
    s.common_cd as service_common_cd,
    s.equipment_name
FROM m_rules_force rf
LEFT JOIN m_services s ON rf.common_cd = s.common_cd
LIMIT 5;

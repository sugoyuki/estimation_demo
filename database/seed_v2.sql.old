-- テストデータ投入スクリプト v2.0
-- Excel仕様準拠版

-- ===================================
-- M_Services: 共通校正項目マスタ
-- ===================================

-- 熱学001: ガラス製温度計
INSERT INTO M_Services (service_id, revenue_category, field, equipment_name, equipment_type1, equipment_type2, combination, main_option, option_name, calibration_item, method) VALUES
(1, '熱学', '一般', 'ガラス製温度計', NULL, NULL, '組み合わせ', 'メイン', NULL, '温度', NULL);

-- 熱学002: 温度計
INSERT INTO M_Services (service_id, revenue_category, field, equipment_name, equipment_type1, equipment_type2, combination, main_option, option_name, calibration_item, method) VALUES
(2, '熱学', '一般', '温度計', NULL, NULL, '組み合わせ', 'メイン', NULL, '温度', NULL);

-- 熱学003: 表面温度計
INSERT INTO M_Services (service_id, revenue_category, field, equipment_name, equipment_type1, equipment_type2, combination, main_option, option_name, calibration_item, method) VALUES
(3, '熱学', '一般', '表面温度計', NULL, NULL, '組み合わせ', 'メイン', NULL, '温度', NULL);

-- 熱学011: 熱電対（シース、E、センサ単体）
INSERT INTO M_Services (service_id, revenue_category, field, equipment_name, equipment_type1, equipment_type2, combination, main_option, option_name, calibration_item, method) VALUES
(11, '熱学', '一般', '熱電対', 'シース', 'E', 'センサ単体', 'メイン', NULL, '熱起電力', NULL);

-- 力学012: 力計（荷重）
INSERT INTO M_Services (service_id, revenue_category, field, equipment_name, equipment_type1, equipment_type2, combination, main_option, option_name, calibration_item, method) VALUES
(12, '熱学', '力学', '力計', NULL, NULL, NULL, NULL, NULL, '荷重', 'JIS B7728, JIS B7602, JIS B 7721');

-- ===================================
-- M_Rules_General: 一般分野料金ルール
-- ===================================

-- 汎用1: 熱学001（ガラス製温度計）0.1℃以下、温度 -100℃ <= x <= 0℃
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(1, '0.1℃以下', '温度', -100, '℃', TRUE, 0, '℃', TRUE, 6000);

-- 汎用2: 熱学001（ガラス製温度計）0.1℃以下、温度 0℃ < x <= 100℃
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(1, '0.1℃以下', '温度', 0, '℃', FALSE, 100, '℃', TRUE, 6000);

-- 汎用3: 熱学001（ガラス製温度計）0.1℃以下、温度 100℃ < x <= 200℃
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(1, '0.1℃以下', '温度', 100, '℃', FALSE, 200, '℃', TRUE, 6000);

-- 汎用4: 熱学001（ガラス製温度計）0.1℃以下、温度 200℃ < x <= 300℃
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(1, '0.1℃以下', '温度', 200, '℃', FALSE, 300, '℃', TRUE, 6000);

-- 汎用5: 熱学001（ガラス製温度計）0.1℃以下、温度 300℃ < x <= 500℃
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(1, '0.1℃以下', '温度', 300, '℃', FALSE, 500, '℃', TRUE, 6000);

-- 汎用6~10: 熱学001（ガラス製温度計）0.2℃以上
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(1, '0.2℃以上', '温度', -100, '℃', TRUE, 0, '℃', TRUE, 6000),
(1, '0.2℃以上', '温度', 0, '℃', FALSE, 100, '℃', TRUE, 6000),
(1, '0.2℃以上', '温度', 100, '℃', FALSE, 200, '℃', TRUE, 6000),
(1, '0.2℃以上', '温度', 200, '℃', FALSE, 300, '℃', TRUE, 6000),
(1, '0.2℃以上', '温度', 300, '℃', FALSE, 500, '℃', TRUE, 6000);

-- 汎用11~17: 熱学002（温度計）
INSERT INTO M_Rules_General (service_id, resolution, range1_name, range1_min, range1_min_unit, range1_min_included, range1_max, range1_max_unit, range1_max_included, point_fee) VALUES
(2, '-', '温度', -195.8, '℃', TRUE, -195.8, '℃', TRUE, 0),
(2, '0.01℃以下', '温度', -100, '℃', TRUE, 0, '℃', TRUE, 5000),
(2, '0.01℃以下', '温度', 0, '℃', FALSE, 100, '℃', TRUE, 5000),
(2, '0.01℃以下', '温度', 100, '℃', FALSE, 250, '℃', TRUE, 5000),
(2, '0.01℃以下', '温度', 250, '℃', FALSE, 500, '℃', TRUE, 5000),
(2, '0.01℃以下', '温度', 500, '℃', FALSE, 1200, '℃', TRUE, 5000),
(2, '-', '温度', 1200, '℃', FALSE, 1554, '℃', TRUE, 5000);

-- ===================================
-- M_Rules_Force: 力学分野料金ルール
-- ===================================

-- 力1: 力学012（力計）荷重 0kN~2kN、荷重方向 片方向
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 0, 'kN', 2, 'kN', '荷重方向', '片方向', 4000, 39900);

-- 力2: 力学012（力計）荷重 2kN~20kN、荷重方向 片方向
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 2, 'kN', 20, 'kN', '荷重方向', '片方向', 4500, 44100);

-- 力3: 力学012（力計）荷重 20kN~100kN、荷重方向 片方向
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 20, 'kN', 100, 'kN', '荷重方向', '片方向', 5800, 57800);

-- 力4: 力学012（力計）荷重 0kN~2kN、荷重方向 両方向
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 0, 'kN', 2, 'kN', '荷重方向', '両方向', 4000, 79800);

-- 力5: 力学012（力計）荷重 2kN~20kN、荷重方向 両方向
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 2, 'kN', 20, 'kN', '荷重方向', '両方向', 4200, 88200);

-- 力6: 力学012（力計）荷重 20kN~100kN、荷重方向 両方向
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 20, 'kN', 100, 'kN', '荷重方向', '両方向', 5500, 115600);

-- 力7~9: ASTM E74など他の手法
INSERT INTO M_Rules_Force (service_id, range1_name, range1_min, range1_min_unit, range1_max, range1_max_unit, range2_name, range2_value, point_fee, base_fee) VALUES
(12, '荷重', 0, 'MN', 1, 'MN', '荷重方向', '-', 6800, 67200),
(12, '荷重', 2, 'MN', 2, 'MN', '荷重方向', '-', 10000, 99800),
(12, '荷重', 20, 'MN', 3, 'MN', '荷重方向', '-', 11600, 116000);

-- ===================================
-- T_Calibration_Requests: サンプル見積
-- ===================================

INSERT INTO T_Calibration_Requests (request_number, customer_name, request_date, status, notes) VALUES
('EST-2025-001', '株式会社テスト', '2025-11-10', 'draft', 'Excel仕様準拠版のテストデータ');

-- ===================================
-- T_Calibration_Items: サンプル見積明細
-- ===================================

-- 見積明細: ガラス製温度計（一般分野）
INSERT INTO T_Calibration_Items (request_id, service_id, item_name, manufacturer, model_number, serial_number, quantity, point_count, range1_value, base_fee, point_fee, subtotal) VALUES
(1, 1, 'ガラス製温度計', 'EXAMPLE', 'GT-100', 'S001', 1, 5, 50, 0, 6000, 30000);

-- 見積明細: 力計（力学分野）
INSERT INTO T_Calibration_Items (request_id, service_id, item_name, manufacturer, model_number, serial_number, quantity, point_count, force_range1_value, force_range2_value, base_fee, point_fee, subtotal) VALUES
(1, 12, '力計', 'FORCE Inc.', 'FC-50', 'F001', 1, 10, 10, '片方向', 44100, 4500, 89100);

-- 見積合計金額の更新
UPDATE T_Calibration_Requests
SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM T_Calibration_Items
    WHERE request_id = T_Calibration_Requests.request_id
);

-- ===================================
-- データ確認用クエリ
-- ===================================

-- SELECT * FROM M_Services;
-- SELECT * FROM M_Rules_General ORDER BY service_id, range1_min;
-- SELECT * FROM M_Rules_Force ORDER BY service_id, range1_min;
-- SELECT * FROM T_Calibration_Requests;
-- SELECT * FROM T_Calibration_Items;

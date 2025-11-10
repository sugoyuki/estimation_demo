-- テストデータ投入スクリプト

-- ===================================
-- M_Services: 校正サービスマスタ
-- ===================================

INSERT INTO M_Services (service_name, category, base_fee, requires_point_calc) VALUES
-- 一般分野
('トルクレンチ校正', '一般', 5000.00, TRUE),
('温度計校正', '一般', 3000.00, TRUE),
('圧力計校正', '一般', 4000.00, TRUE),
('長さ測定器校正', '一般', 3500.00, TRUE),

-- 力学分野
('引張・圧縮試験機校正', '力学', 0.00, TRUE),
('硬さ試験機校正', '力学', 0.00, TRUE),
('分銅校正', '力学', 2000.00, FALSE);

-- ===================================
-- M_Rules_General: 一般分野料金ルール
-- ===================================

-- トルクレンチ校正
INSERT INTO M_Rules_General (service_id, service_type, range_min, range_max, unit, point_fee) VALUES
(1, 'トルク', 0, 50, 'N·m', 1000.00),
(1, 'トルク', 50.01, 200, 'N·m', 1500.00),
(1, 'トルク', 200.01, 500, 'N·m', 2000.00),
(1, 'トルク', 500.01, 1000, 'N·m', 2500.00);

-- 温度計校正
INSERT INTO M_Rules_General (service_id, service_type, range_min, range_max, unit, point_fee) VALUES
(2, '温度', -50, 0, '℃', 800.00),
(2, '温度', 0.01, 100, '℃', 600.00),
(2, '温度', 100.01, 300, '℃', 700.00),
(2, '温度', 300.01, 1000, '℃', 900.00);

-- 圧力計校正
INSERT INTO M_Rules_General (service_id, service_type, range_min, range_max, unit, point_fee) VALUES
(3, '圧力', 0, 1, 'MPa', 1200.00),
(3, '圧力', 1.01, 10, 'MPa', 1500.00),
(3, '圧力', 10.01, 50, 'MPa', 1800.00),
(3, '圧力', 50.01, 100, 'MPa', 2200.00);

-- 長さ測定器校正
INSERT INTO M_Rules_General (service_id, service_type, range_min, range_max, unit, point_fee) VALUES
(4, '長さ', 0, 100, 'mm', 500.00),
(4, '長さ', 100.01, 500, 'mm', 700.00),
(4, '長さ', 500.01, 1000, 'mm', 1000.00),
(4, '長さ', 1000.01, 3000, 'mm', 1500.00);

-- ===================================
-- M_Rules_Force: 力学分野料金ルール
-- ===================================

-- 引張・圧縮試験機校正
INSERT INTO M_Rules_Force (service_id, capacity_min, capacity_max, capacity_unit, point_count_min, point_count_max, point_fee) VALUES
-- 能力 50kN以下
(5, 0, 50, 'kN', 1, 3, 15000.00),
(5, 0, 50, 'kN', 4, 6, 18000.00),
(5, 0, 50, 'kN', 7, NULL, 21000.00),

-- 能力 50kN超～200kN
(5, 50.01, 200, 'kN', 1, 3, 25000.00),
(5, 50.01, 200, 'kN', 4, 6, 30000.00),
(5, 50.01, 200, 'kN', 7, NULL, 35000.00),

-- 能力 200kN超～500kN
(5, 200.01, 500, 'kN', 1, 3, 40000.00),
(5, 200.01, 500, 'kN', 4, 6, 50000.00),
(5, 200.01, 500, 'kN', 7, NULL, 60000.00),

-- 能力 500kN超
(5, 500.01, NULL, 'kN', 1, 3, 70000.00),
(5, 500.01, NULL, 'kN', 4, 6, 90000.00),
(5, 500.01, NULL, 'kN', 7, NULL, 110000.00);

-- 硬さ試験機校正
INSERT INTO M_Rules_Force (service_id, capacity_min, capacity_max, capacity_unit, point_count_min, point_count_max, point_fee) VALUES
(6, NULL, NULL, 'HRC', 1, 3, 8000.00),
(6, NULL, NULL, 'HRC', 4, 6, 10000.00),
(6, NULL, NULL, 'HRC', 7, NULL, 12000.00),

(6, NULL, NULL, 'HV', 1, 3, 7000.00),
(6, NULL, NULL, 'HV', 4, 6, 9000.00),
(6, NULL, NULL, 'HV', 7, NULL, 11000.00);

-- ===================================
-- T_Calibration_Requests: サンプル見積
-- ===================================

INSERT INTO T_Calibration_Requests (request_number, customer_name, request_date, status, notes) VALUES
('EST-2025-001', '株式会社サンプル製作所', '2025-11-01', 'draft', '新規顧客からの初回見積'),
('EST-2025-002', '山田工業株式会社', '2025-11-05', 'confirmed', '定期校正案件');

-- ===================================
-- T_Calibration_Items: サンプル見積明細
-- ===================================

-- 見積 EST-2025-001 の明細
INSERT INTO T_Calibration_Items (
    request_id, service_id, item_name, manufacturer, model_number, serial_number,
    quantity, point_count, measurement_range_min, measurement_range_max, measurement_unit,
    base_fee, point_fee, subtotal
) VALUES
(1, 1, 'デジタルトルクレンチ', 'TOHNICHI', 'CEM100N3X15D', 'S12345',
 1, 5, 10, 100, 'N·m', 5000.00, 1500.00, 12500.00),

(1, 2, '高精度温度計', 'CHINO', 'E052-12', 'T67890',
 1, 3, -10, 50, '℃', 3000.00, 600.00, 4800.00);

-- 見積 EST-2025-002 の明細
INSERT INTO T_Calibration_Items (
    request_id, service_id, item_name, manufacturer, model_number, serial_number,
    quantity, point_count, capacity_value, capacity_unit,
    base_fee, point_fee, subtotal
) VALUES
(2, 5, '万能試験機', 'SHIMADZU', 'AGS-X', 'M11111',
 1, 5, 100, 'kN', 0.00, 30000.00, 30000.00),

(2, 6, 'ロックウェル硬さ試験機', 'Mitutoyo', 'HR-522', 'H22222',
 1, 4, NULL, 'HRC', 0.00, 10000.00, 10000.00);

-- 見積合計金額の更新
UPDATE T_Calibration_Requests
SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM T_Calibration_Items
    WHERE request_id = T_Calibration_Requests.request_id
);

-- ===================================
-- データ確認用クエリ（コメント）
-- ===================================

-- SELECT * FROM M_Services;
-- SELECT * FROM M_Rules_General ORDER BY service_id, range_min;
-- SELECT * FROM M_Rules_Force ORDER BY service_id, capacity_min, point_count_min;
-- SELECT * FROM T_Calibration_Requests;
-- SELECT * FROM T_Calibration_Items;

-- 見積詳細確認
-- SELECT
--     r.request_number,
--     r.customer_name,
--     r.total_amount,
--     i.item_name,
--     s.service_name,
--     i.subtotal
-- FROM T_Calibration_Requests r
-- JOIN T_Calibration_Items i ON r.request_id = i.request_id
-- JOIN M_Services s ON i.service_id = s.service_id
-- ORDER BY r.request_id, i.item_id;

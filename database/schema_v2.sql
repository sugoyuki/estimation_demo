-- 校正料金自動算出システム データベーススキーマ v2.0
-- Excel仕様完全準拠版

-- 既存のテーブルを削除
DROP TABLE IF EXISTS T_Calibration_Items CASCADE;
DROP TABLE IF EXISTS T_Calibration_Requests CASCADE;
DROP TABLE IF EXISTS M_Rules_Force CASCADE;
DROP TABLE IF EXISTS M_Rules_General CASCADE;
DROP TABLE IF EXISTS M_Services CASCADE;

-- ===================================
-- マスタテーブル
-- ===================================

-- M_Services: 共通校正項目マスタ（親テーブル）
CREATE TABLE M_Services (
    service_id SERIAL PRIMARY KEY,                      -- 共通Cd
    revenue_category VARCHAR(100),                      -- 収入区分
    field VARCHAR(100) NOT NULL,                        -- 分野（一般、力学）
    equipment_name VARCHAR(255) NOT NULL,               -- 機器名
    equipment_type1 VARCHAR(100),                       -- 機器種類1
    equipment_type2 VARCHAR(100),                       -- 機器種類2
    combination VARCHAR(100),                           -- 組み合わせ
    main_option VARCHAR(100),                           -- メイン・オプション
    option_name VARCHAR(255),                           -- オプション名
    calibration_item VARCHAR(255),                      -- 校正項目
    method VARCHAR(255),                                -- 手法
    is_active BOOLEAN DEFAULT TRUE,                     -- 有効フラグ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_services_field ON M_Services(field);
CREATE INDEX idx_services_equipment_name ON M_Services(equipment_name);
CREATE INDEX idx_services_active ON M_Services(is_active);

-- M_Rules_General: 一般分野料金ルール（子テーブル）
CREATE TABLE M_Rules_General (
    rule_id SERIAL PRIMARY KEY,                         -- 分野Cd（汎用ID）
    service_id INTEGER NOT NULL REFERENCES M_Services(service_id) ON DELETE CASCADE,  -- 共通Cd（FK）
    resolution VARCHAR(100),                            -- 分解能

    -- 範囲1
    range1_name VARCHAR(100),                           -- 範囲1名称
    range1_min DECIMAL(15, 6),                          -- 範囲1min
    range1_min_unit VARCHAR(50),                        -- 範囲1min単位
    range1_min_included BOOLEAN DEFAULT TRUE,           -- 範囲1min_included（1=含む、0=含まない）
    range1_max DECIMAL(15, 6),                          -- 範囲1Max
    range1_max_unit VARCHAR(50),                        -- 範囲1Max単位
    range1_max_included BOOLEAN DEFAULT TRUE,           -- 範囲1Max_included

    -- 範囲2（オプショナル）
    range2_name VARCHAR(100),                           -- 範囲2名称
    range2_min DECIMAL(15, 6),                          -- 範囲2min
    range2_min_unit VARCHAR(50),                        -- 範囲2min単位
    range2_min_included BOOLEAN DEFAULT TRUE,           -- 範囲2min_included
    range2_max DECIMAL(15, 6),                          -- 範囲2Max
    range2_max_unit VARCHAR(50),                        -- 範囲2Max単位
    range2_max_included BOOLEAN DEFAULT TRUE,           -- 範囲2Max_included

    point_fee DECIMAL(10, 2) NOT NULL,                  -- 点数料金
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_rules_general_service ON M_Rules_General(service_id);
CREATE INDEX idx_rules_general_range1 ON M_Rules_General(range1_min, range1_max);

-- M_Rules_Force: 力学分野料金ルール（子テーブル）
CREATE TABLE M_Rules_Force (
    rule_id SERIAL PRIMARY KEY,                         -- 分野Cd（力学ID）
    service_id INTEGER NOT NULL REFERENCES M_Services(service_id) ON DELETE CASCADE,  -- 共通Cd（FK）

    -- 範囲1（荷重など）
    range1_name VARCHAR(100),                           -- 範囲1名称（例：荷重）
    range1_min DECIMAL(15, 6),                          -- 範囲1min
    range1_min_unit VARCHAR(50),                        -- 範囲1min単位
    range1_max DECIMAL(15, 6),                          -- 範囲1Max
    range1_max_unit VARCHAR(50),                        -- 範囲1Max単位

    -- 範囲2（荷重方向など）
    range2_name VARCHAR(100),                           -- 範囲2名称（例：荷重方向）
    range2_value VARCHAR(100),                          -- 範囲2（例：片方向、両方向、-）

    point_fee DECIMAL(10, 2) NOT NULL,                  -- 点数料金
    base_fee DECIMAL(10, 2) DEFAULT 0.00,               -- 基本料金
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_rules_force_service ON M_Rules_Force(service_id);
CREATE INDEX idx_rules_force_range1 ON M_Rules_Force(range1_min, range1_max);

-- ===================================
-- トランザクションテーブル
-- ===================================

-- T_Calibration_Requests: 校正依頼（見積）
CREATE TABLE T_Calibration_Requests (
    request_id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,         -- 見積番号
    customer_name VARCHAR(255) NOT NULL,                -- 顧客名
    request_date DATE NOT NULL,                         -- 依頼日
    total_amount DECIMAL(12, 2) DEFAULT 0.00,           -- 見積合計金額
    status VARCHAR(50) DEFAULT 'draft',                 -- ステータス（draft, confirmed, completed）
    notes TEXT,                                         -- 備考
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_requests_number ON T_Calibration_Requests(request_number);
CREATE INDEX idx_requests_customer ON T_Calibration_Requests(customer_name);
CREATE INDEX idx_requests_date ON T_Calibration_Requests(request_date);

-- T_Calibration_Items: 校正明細（見積明細）
CREATE TABLE T_Calibration_Items (
    item_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES T_Calibration_Requests(request_id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES M_Services(service_id),

    -- 入力情報
    item_name VARCHAR(255) NOT NULL,                    -- 校正品名
    manufacturer VARCHAR(255),                          -- メーカー
    model_number VARCHAR(255),                          -- 型式
    serial_number VARCHAR(255),                         -- シリアル番号

    -- 料金計算用情報
    quantity INTEGER DEFAULT 1,                         -- 数量
    point_count INTEGER,                                -- 点数

    -- 一般分野用（範囲値）
    range1_value DECIMAL(15, 6),                        -- 範囲1の値
    range2_value DECIMAL(15, 6),                        -- 範囲2の値

    -- 力学分野用
    force_range1_value DECIMAL(15, 6),                  -- 荷重などの値
    force_range2_value VARCHAR(100),                    -- 荷重方向など

    -- 算出料金
    base_fee DECIMAL(10, 2) DEFAULT 0.00,              -- 基本料金
    point_fee DECIMAL(10, 2) DEFAULT 0.00,             -- 点数料金
    subtotal DECIMAL(10, 2) DEFAULT 0.00,              -- 小計

    notes TEXT,                                         -- 備考
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_items_request ON T_Calibration_Items(request_id);
CREATE INDEX idx_items_service ON T_Calibration_Items(service_id);

-- ===================================
-- トリガー関数（updated_atの自動更新）
-- ===================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー設定
CREATE TRIGGER update_m_services_updated_at BEFORE UPDATE ON M_Services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_m_rules_general_updated_at BEFORE UPDATE ON M_Rules_General
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_m_rules_force_updated_at BEFORE UPDATE ON M_Rules_Force
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_t_calibration_requests_updated_at BEFORE UPDATE ON T_Calibration_Requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_t_calibration_items_updated_at BEFORE UPDATE ON T_Calibration_Items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- コメント
-- ===================================

COMMENT ON TABLE M_Services IS '共通校正項目マスタ（親テーブル）- Excel「共通項」シートに対応';
COMMENT ON TABLE M_Rules_General IS '一般分野料金ルールマスタ - Excel「汎用」シートに対応';
COMMENT ON TABLE M_Rules_Force IS '力学分野料金ルールマスタ - Excel「力」シートに対応';
COMMENT ON TABLE T_Calibration_Requests IS '校正依頼（見積）';
COMMENT ON TABLE T_Calibration_Items IS '校正明細（見積明細）';

COMMENT ON COLUMN M_Rules_General.range1_min_included IS '1=境界を含む(>=)、0=境界を含まない(>)';
COMMENT ON COLUMN M_Rules_General.range1_max_included IS '1=境界を含む(<=)、0=境界を含まない(<)';
COMMENT ON COLUMN M_Rules_General.range2_min_included IS '1=境界を含む(>=)、0=境界を含まない(>)';
COMMENT ON COLUMN M_Rules_General.range2_max_included IS '1=境界を含む(<=)、0=境界を含まない(<)';

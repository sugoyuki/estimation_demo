-- 校正料金自動算出システム データベーススキーマ

-- データベース作成（既存の場合はスキップ）
-- CREATE DATABASE calibration_system;

-- 既存のテーブルを削除（開発時のみ）
DROP TABLE IF EXISTS T_Calibration_Items CASCADE;
DROP TABLE IF EXISTS T_Calibration_Requests CASCADE;
DROP TABLE IF EXISTS M_Rules_Force CASCADE;
DROP TABLE IF EXISTS M_Rules_General CASCADE;
DROP TABLE IF EXISTS M_Services CASCADE;

-- ===================================
-- マスタテーブル
-- ===================================

-- M_Services: 校正サービスマスタ（親テーブル）
CREATE TABLE M_Services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,           -- サービス名
    category VARCHAR(100) NOT NULL,                -- 分野（例: 一般, 力学）
    base_fee DECIMAL(10, 2) DEFAULT 0.00,         -- 基本料金
    requires_point_calc BOOLEAN DEFAULT FALSE,     -- 点数計算が必要か
    is_active BOOLEAN DEFAULT TRUE,                -- 有効フラグ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_services_category ON M_Services(category);
CREATE INDEX idx_services_active ON M_Services(is_active);

-- M_Rules_General: 一般分野料金ルール（子テーブル）
CREATE TABLE M_Rules_General (
    rule_id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES M_Services(service_id) ON DELETE CASCADE,
    service_type VARCHAR(100),                     -- サービスタイプ（例: トルク, 温度）
    range_min DECIMAL(15, 6),                      -- 測定範囲最小値
    range_max DECIMAL(15, 6),                      -- 測定範囲最大値
    unit VARCHAR(50),                              -- 単位
    point_fee DECIMAL(10, 2) NOT NULL,            -- 点数料金
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id, service_type, range_min, range_max, unit)
);

-- インデックス
CREATE INDEX idx_rules_general_service ON M_Rules_General(service_id);
CREATE INDEX idx_rules_general_type ON M_Rules_General(service_type);

-- M_Rules_Force: 力学分野料金ルール（子テーブル）
CREATE TABLE M_Rules_Force (
    rule_id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES M_Services(service_id) ON DELETE CASCADE,
    capacity_min DECIMAL(15, 6),                   -- 能力範囲最小値
    capacity_max DECIMAL(15, 6),                   -- 能力範囲最大値
    capacity_unit VARCHAR(50),                     -- 能力単位
    point_count_min INTEGER,                       -- 点数範囲最小値
    point_count_max INTEGER,                       -- 点数範囲最大値
    point_fee DECIMAL(10, 2) NOT NULL,            -- 点数料金
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_rules_force_service ON M_Rules_Force(service_id);
CREATE INDEX idx_rules_force_capacity ON M_Rules_Force(capacity_min, capacity_max);

-- ===================================
-- トランザクションテーブル
-- ===================================

-- T_Calibration_Requests: 校正依頼（見積）
CREATE TABLE T_Calibration_Requests (
    request_id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,    -- 見積番号
    customer_name VARCHAR(255) NOT NULL,           -- 顧客名
    request_date DATE NOT NULL,                    -- 依頼日
    total_amount DECIMAL(12, 2) DEFAULT 0.00,     -- 見積合計金額
    status VARCHAR(50) DEFAULT 'draft',            -- ステータス（draft, confirmed, completed）
    notes TEXT,                                    -- 備考
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
    item_name VARCHAR(255) NOT NULL,               -- 校正品名
    manufacturer VARCHAR(255),                     -- メーカー
    model_number VARCHAR(255),                     -- 型式
    serial_number VARCHAR(255),                    -- シリアル番号

    -- 料金計算用情報
    quantity INTEGER DEFAULT 1,                    -- 数量
    point_count INTEGER,                           -- 点数（該当する場合）

    -- 一般分野用
    measurement_range_min DECIMAL(15, 6),          -- 測定範囲最小値
    measurement_range_max DECIMAL(15, 6),          -- 測定範囲最大値
    measurement_unit VARCHAR(50),                  -- 測定単位

    -- 力学分野用
    capacity_value DECIMAL(15, 6),                 -- 能力値
    capacity_unit VARCHAR(50),                     -- 能力単位

    -- 算出料金
    base_fee DECIMAL(10, 2) DEFAULT 0.00,         -- 基本料金
    point_fee DECIMAL(10, 2) DEFAULT 0.00,        -- 点数料金
    subtotal DECIMAL(10, 2) DEFAULT 0.00,         -- 小計（基本料金 + 点数料金 × 点数）

    notes TEXT,                                    -- 備考
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

COMMENT ON TABLE M_Services IS '校正サービスマスタ（全分野共通の親テーブル）';
COMMENT ON TABLE M_Rules_General IS '一般分野料金ルールマスタ';
COMMENT ON TABLE M_Rules_Force IS '力学分野料金ルールマスタ';
COMMENT ON TABLE T_Calibration_Requests IS '校正依頼（見積）';
COMMENT ON TABLE T_Calibration_Items IS '校正明細（見積明細）';

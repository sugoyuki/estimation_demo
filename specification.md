# 校正料金自動算出システム 開発ドキュメント

## 1. 概要

### 1-1. 目的
本システムは、機器校正の見積作成時に入力された校正内容（サービス、校正値、条件）に基づき、料金マスタを自動的に参照し、正確な基本料金および点数料金を算出することを目的とする。

### 1-2. 設計方針
「Class Table Inheritance (クラス・テーブル継承)」パターンを採用する。

* **`M_Services` (親テーブル):**
    分野（"力"、"温度"）を問わず、全校正サービスに共通する項目（機器名、校正項目、分野など）を管理する。
* **`M_Rules_*` (子テーブル):**
    料金算出の「条件」が異なる分野ごとに、専用の料金ルールテーブル（例: `M_Rules_General`, `M_Rules_Force`）を作成する。

`M_Services`テーブルの`field`（分野）カラムの値を見て、アプリケーション側が参照すべき「子テーブル」を動的に切り替える。

---

## 2. システム要件定義

### 2-1. 主要機能
1.  **マスタ管理機能 (CRUD)**
    * 校正サービス（`M_Services`）の登録・編集・参照・削除。
    * 各分野の料金ルール（`M_Rules_General`, `M_Rules_Force`）の登録・編集・参照・削除。
2.  **見積作成機能**
    * 見積のヘッダ情報（顧客情報、件名など）を作成する（`T_Calibration_Requests`）。
    * 見積の明細情報（`T_Calibration_Request_Items`）を追加する。
3.  **料金自動計算機能（システムの核）**
    * 見積明細作成時、ユーザーが「校正サービス」と「校正値（数値）」、「その他条件（文字列など）」を入力する。
    * システムは入力に基づき、「2-2. 料金自動計算ロGック」を実行し、該当する基本料金と点数料金を自動で取得・表示する。

### 2-2. 料金自動計算ロジック
システムは、明細追加時に以下の処理を内部で実行する。

1.  **分野の特定:** ユーザーが選択した`service_id`（例: "力学012"）をキーに`M_Services`を参照し、`field`カラムの値（例: "力"）を取得する。
2.  **ロジック分岐:** `field`の値に基づき、検索ロジックと参照テーブルを切り替える。
    * `field` = "力" の場合: **Force_Logic** を実行
    * `field` = "温度" の場合: **General_Logic** を実行
3.  **検索実行 (Force_Logic の例)**
    * **ユーザー入力:** `service_id`="力学012", `input_load`=50 (kN), `input_direction`="片方向"
    * **実行クエリ (イメージ):**
        ```sql
        SELECT base_fee, point_fee
        FROM M_Rules_Force
        WHERE service_id = '力学012'
          AND 50 BETWEEN range1_min AND range1_max
          AND range2_value = '片方向';
        ```
4.  **検索実行 (General_Logic の例)**
    * **ユーザー入力:** `service_id`="熱学001", `input_temp`=50 (℃), `condition`="0.1℃以下"
    * **実行クエリ (イメージ):**
        ```sql
        SELECT base_fee, point_fee
        FROM M_Rules_General
        WHERE service_id = '熱学001'
          AND 50 BETWEEN range1_min AND range1_max
          AND condition_desc = '0.1℃以下';
        ```
5.  **結果の返却:** 取得した`base_fee`, `point_fee`を見積明細にセットする。

### 2-3. 非機能要件
* **保守性:** 既存分野（例: "力"）の料金改定や範囲追加は、`M_Rules_Force`テーブルのデータ修正・追加のみで対応可能であること（**プログラム改修は不要**）。
* **拡張性:** 将来、全く新しい分野（例: "寸法"）を追加する場合、DBに`M_Rules_Dimension`テーブルを新規作成し、アプリケーション側に`Dimension_Logic`を追加する**プログラム改修が必要**となる。（これは本設計のトレードオフ）

---

## 3. データベース設計

### 3-1. ER図 (概念)

[M_Services (親)] 1 --< N [M_Rules_General (子)] (service_id) (service_id) | | '--< N [M_Rules_Force (子)] (service_id)

[T_Calibration_Requests (見積ヘッダ)] 1 --< N [T_Calibration_Request_Items (見積明細)] (request_id) (request_id) (service_id) --< N [M_Services]


### 3-2. テーブル定義書

### A. マスタテーブル

#### 1. M_Services (校正サービスマスタ)
全サービスに共通する「親」マスタ。`共通校正項目.jpg`に相当。

| 論理名 (日本語) | 物理名 (英語) | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| **共通Cd** | `service_id` | `VARCHAR(20)` | **PK** | 主キー。例: "熱学001" |
| **分野** | `field` | `VARCHAR(50)` | `NOT NULL` | "力", "温度" など。ロジック分岐に使う |
| 収入区分 | `revenue_segment` | `VARCHAR(50)` | | |
| 機器名 | `service_name` | `VARCHAR(100)`| `NOT NULL` | 例: "ガラス製温度計" |
| 機器種類1 | `equipment_type_1` | `VARCHAR(50)` | | |
| 機器種類2 | `equipment_type_2` | `VARCHAR(50)` | | |
| 組み合わせ | `combination` | `VARCHAR(50)` | | |
| メイン・オプション | `main_option` | `VARCHAR(50)` | | |
| オプション名 | `option_name` | `VARCHAR(100)`| | |
| 校正項目 | `calibration_item`| `VARCHAR(100)`| | 例: "温度" |
| 手法 | `method` | `VARCHAR(100)` | | 例: "比較校正" |
| 作成日時 | `created_at` | `DATETIME` | | |
| 更新日時 | `updated_at` | `DATETIME` | | |

#### 2. M_Rules_General (汎用分野 料金ルール)
「温度」など、数値範囲x2で料金が決まる分野の「子」テーブル。`汎用.jpg`に相当。

| 論理名 (日本語) | 物理名 (英語) | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| **ルールID** | `rule_id` | `INT` | **PK**, `AUTO_INCREMENT` | 料金ルールの一意なID |
| **共通Cd** | `service_id` | `VARCHAR(20)` | **FK** (`M_Services`) | どのサービスに紐づくか |
| 分解能など | `condition_desc` | `VARCHAR(100)`| | 例: "0.1℃以下" |
| 範囲1名称 | `range1_name` | `VARCHAR(50)` | | 例: "温度" |
| **範囲1Min** | `range1_min` | `DECIMAL(10, 3)`| `NOT NULL` | 例: 0 |
| **範囲1Max** | `range1_max` | `DECIMAL(10, 3)`| `NOT NULL` | 例: 100 |
| 範囲1単位 | `range1_unit` | `VARCHAR(20)` | | 例: "℃" |
| 範囲2名称 | `range2_name` | `VARCHAR(50)` | | |
| 範囲2Min | `range2_min` | `DECIMAL(10, 3)`| | |
| 範囲2Max | `range2_max` | `DECIMAL(10, 3)`| | |
| 範囲2単位 | `range2_unit` | `VARCHAR(20)` | | |
| **点数料金** | `point_fee` | `INT` | `NOT NULL` | |
| **基本料金** | `base_fee` | `INT` | `NOT NULL` | |
| 作成日時 | `created_at` | `DATETIME` | | |
| 更新日時 | `updated_at` | `DATETIME` | | |

#### 3. M_Rules_Force (力分野 料金ルール)
「力」など、数値範囲x1 + 文字列条件x1で料金が決まる分野の「子」テーブル。`力.png`に相当。

| 論理名 (日本語) | 物理名 (英語) | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| **ルールID** | `rule_id` | `INT` | **PK**, `AUTO_INCREMENT` | 料金ルールの一意なID |
| **共通Cd** | `service_id` | `VARCHAR(20)` | **FK** (`M_Services`) | どのサービスに紐づくか |
| 範囲名称 | `condition_desc` | `VARCHAR(100)`| | 例: "荷重" |
| 範囲1名称 | `range1_name` | `VARCHAR(50)` | | 例: "荷重" |
| **範囲1Min** | `range1_min` | `DECIMAL(10, 3)`| `NOT NULL` | 例: 0 |
| **範囲1Max** | `range1_max` | `DECIMAL(10, 3)`| `NOT NULL` | 例: 2 |
| 範囲1単位 | `range1_unit` | `VARCHAR(20)` | | 例: "kN" |
| 範囲2名称 | `range2_name` | `VARCHAR(50)` | | 例: "荷重方向" |
| **範囲2** | `range2_value` | `VARCHAR(50)` | `NOT NULL` | 例: "片方向", "両方向" |
| **点数料金** | `point_fee` | `INT` | `NOT NULL` | |
| **基本料金** | `base_fee` | `INT` | `NOT NULL` | |
| 作成日時 | `created_at` | `DATETIME` | | |
| 更新日時 | `updated_at` | `DATETIME` | | |

---

### B. トランザクションテーブル (見積作成用)

#### 4. T_Calibration_Requests (校正依頼ヘッダ)
見積・依頼の全体を管理するテーブル。

| 論理名 (日本語) | 物理名 (英語) | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| **依頼ID** | `request_id` | `INT` | **PK**, `AUTO_INCREMENT` | 見積の一意なID |
| 顧客ID | `customer_id` | `INT` | `FK` | 顧客マスタへのFK |
| 依頼日 | `request_date` | `DATE` | | |
| ステータス | `status` | `VARCHAR(20)` | | 例: "見積中", "受注済" |
| 合計金額 | `total_fee` | `INT` | | `T_Calibration_Request_Items`の合計 |
| ... | | | | |
| 作成日時 | `created_at` | `DATETIME` | | |
| 更新日時 | `updated_at` | `DATETIME` | | |

#### 5. T_Calibration_Request_Items (校正依頼明細)
見積・依頼の明細（どのサービスを、何点、いくらで）を管理するテーブル。

| 論理名 (日本語) | 物理名 (英語) | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| **明細ID** | `item_id` | `INT` | **PK**, `AUTO_INCREMENT` | |
| **依頼ID** | `request_id` | `INT` | **FK** (`T_Calibration_Requests`) | どの見積の明細か |
| **共通Cd** | `service_id` | `VARCHAR(20)` | **FK** (`M_Services`) | どのサービスか |
| 入力値1 | `input_value1` | `DECIMAL(10, 3)`| | ユーザーが入力した数値 (例: 50) |
| 入力条件2 | `input_value2` | `VARCHAR(50)` | | ユーザーが入力した条件 (例: "片方向") |
| 点数 | `num_points` | `INT` | `NOT NULL` | 校正点数 (例: 3) |
| 適用ルールID | `applied_rule_id` | `INT` | | 料金計算に使用したルールのID (トレーサビリティ用) |
| 計算後_基本料金 | `calculated_base_fee` | `INT` | | 自動計算された基本料金 |
| 計算後_点数料金 | `calculated_point_fee`| `INT` | | 自動計算された点数料金 |
| **明細合計** | `line_total` | `INT` | | (基本料金 + (点数料金 * 点数)) |
| 作成日時 | `created_at` | `DATETIME` | | |
| 更新日時 | `updated_at` | `DATETIME` | | |
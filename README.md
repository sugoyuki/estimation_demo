# 校正料金自動算出システム

機器校正の見積作成時に入力された校正内容に基づき、料金マスタを自動的に参照し、正確な基本料金および点数料金を算出するシステムです。

## 技術スタック

### バックエンド
- **Node.js** + **Express** - RESTful API
- **Sequelize** - ORM
- **PostgreSQL** - データベース

### フロントエンド
- **React** - UIライブラリ
- **Vite** - ビルドツール
- **React Router** - ルーティング
- **Axios** - HTTP クライアント

## プロジェクト構造

```
db_test/
├── backend/              # バックエンドAPI
│   ├── src/
│   │   ├── config/      # データベース設定
│   │   ├── models/      # Sequelizeモデル
│   │   ├── controllers/ # APIコントローラー
│   │   ├── routes/      # ルート定義
│   │   ├── services/    # ビジネスロジック
│   │   └── server.js    # エントリーポイント
│   └── package.json
│
├── frontend/            # Reactフロントエンド
│   ├── src/
│   │   ├── api/        # API通信
│   │   ├── pages/      # ページコンポーネント
│   │   ├── styles/     # CSSスタイル
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/            # データベース関連
│   ├── schema.sql      # テーブル定義
│   └── seed.sql        # テストデータ
│
├── scripts/             # セットアップ・起動スクリプト
│   ├── setup-all.sh    # 全体セットアップ
│   ├── setup-db.sh     # DBセットアップ
│   ├── start-all.sh    # 全体起動
│   ├── start-backend.sh # バックエンド起動
│   └── start-frontend.sh # フロントエンド起動
│
├── specification.md     # システム仕様書
└── README.md           # このファイル
```

## クイックスタート

### 前提条件

- Node.js (v18以上)
- PostgreSQL (v14以上)
- npm

### 簡単セットアップ（推奨）

**初回セットアップ（1回のみ実行）:**

```bash
# すべて自動でセットアップ
./scripts/setup-all.sh
```

このスクリプトは以下を実行します：
- データベースの作成とスキーマ適用
- テストデータの投入（オプション）
- バックエンドとフロントエンドの依存関係インストール
- 環境変数ファイル（.env）の作成

**起動:**

```bash
# すべて一度に起動
./scripts/start-all.sh
```

アクセス:
- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:3000

**個別起動（別ターミナルで実行する場合）:**

```bash
# ターミナル1: バックエンド起動
./scripts/start-backend.sh

# ターミナル2: フロントエンド起動
./scripts/start-frontend.sh
```

### 利用可能なスクリプト

| スクリプト | 説明 |
|-----------|------|
| `./scripts/setup-all.sh` | 初回セットアップ（DB + バックエンド + フロントエンド） |
| `./scripts/setup-db.sh` | データベースのみセットアップ |
| `./scripts/start-all.sh` | 全体起動（tmux使用） |
| `./scripts/start-backend.sh` | バックエンドのみ起動 |
| `./scripts/start-frontend.sh` | フロントエンドのみ起動 |

### 手動セットアップ（オプション）

<details>
<summary>スクリプトを使わず手動でセットアップする場合（クリックして展開）</summary>

#### 1. データベースのセットアップ

```bash
# PostgreSQLにログイン
psql -U postgres

# データベース作成
CREATE DATABASE calibration_system;

# データベースに接続
\c calibration_system

# スキーマ適用
\i database/schema.sql

# テストデータ投入（オプション）
\i database/seed.sql

# 確認
\dt
```

#### 2. バックエンドのセットアップ

```bash
cd backend

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env

# .env ファイルを編集してデータベース接続情報を設定
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=calibration_system
# DB_USER=postgres
# DB_PASSWORD=your_password
# PORT=3000

# 開発サーバー起動
npm run dev
```

バックエンドサーバーが http://localhost:3000 で起動します。

#### 3. フロントエンドのセットアップ

```bash
cd frontend

# 依存関係インストール
npm install

# 環境変数設定（オプション）
cp .env.example .env

# 開発サーバー起動
npm run dev
```

フロントエンドが http://localhost:5173 で起動します。

</details>

## API エンドポイント

### サービスマスタ
- `GET /api/services` - 全サービス取得
- `GET /api/services/:id` - サービス詳細
- `POST /api/services` - サービス作成
- `PUT /api/services/:id` - サービス更新
- `DELETE /api/services/:id` - サービス削除

### 一般分野料金ルール
- `GET /api/rules/general` - 全ルール取得
- `GET /api/rules/general/:id` - ルール詳細
- `POST /api/rules/general` - ルール作成
- `PUT /api/rules/general/:id` - ルール更新
- `DELETE /api/rules/general/:id` - ルール削除

### 力学分野料金ルール
- `GET /api/rules/force` - 全ルール取得
- `GET /api/rules/force/:id` - ルール詳細
- `POST /api/rules/force` - ルール作成
- `PUT /api/rules/force/:id` - ルール更新
- `DELETE /api/rules/force/:id` - ルール削除

### 見積管理
- `GET /api/calibration/requests` - 見積一覧
- `GET /api/calibration/requests/:id` - 見積詳細
- `POST /api/calibration/requests` - 見積作成
- `PUT /api/calibration/requests/:id` - 見積更新
- `DELETE /api/calibration/requests/:id` - 見積削除

### 見積明細
- `POST /api/calibration/requests/:id/items` - 明細追加
- `PUT /api/calibration/requests/:id/items/:itemId` - 明細更新
- `DELETE /api/calibration/requests/:id/items/:itemId` - 明細削除

## 料金計算ロジック

### 一般分野
測定範囲に基づいて適切な料金ルールを検索し、以下の計算を行います：

```
小計 = 基本料金 + (点数料金 × 点数) × 数量
```

### 力学分野
能力値と点数に基づいて適切な料金ルールを検索し、以下の計算を行います：

```
小計 = 基本料金 + (点数料金 × 点数) × 数量
```

## データベーステーブル構造

### マスタテーブル
- **M_Services**: 校正サービスマスタ（親テーブル）
- **M_Rules_General**: 一般分野料金ルール（子テーブル）
- **M_Rules_Force**: 力学分野料金ルール（子テーブル）

### トランザクションテーブル
- **T_Calibration_Requests**: 校正依頼（見積）
- **T_Calibration_Items**: 校正明細（見積明細）

詳細なテーブル定義は `database/schema.sql` を参照してください。

## 使い方

1. **サービスマスタの登録**
   - サービス名、分野（一般/力学）、基本料金を設定

2. **料金ルールの登録**
   - 一般分野: 測定範囲と点数料金を設定
   - 力学分野: 能力範囲、点数範囲、点数料金を設定

3. **見積作成**
   - 顧客情報と校正項目を入力
   - システムが自動的に料金を計算
   - 見積合計金額が自動更新

## 開発・デバッグ

### バックエンドのログ確認
```bash
cd backend
npm run dev
```

### データベースクエリの確認
```bash
# PostgreSQLに接続
psql -U postgres -d calibration_system

# テーブル確認
SELECT * FROM m_services;
SELECT * FROM m_rules_general;
SELECT * FROM m_rules_force;
SELECT * FROM t_calibration_requests;
SELECT * FROM t_calibration_items;
```

### API動作確認（curl）
```bash
# サービス一覧取得
curl http://localhost:3000/api/services

# ヘルスチェック
curl http://localhost:3000/health
```

## トラブルシューティング

### スクリプト実行時にパーミッションエラーが発生する
```bash
chmod +x scripts/*.sh
```

### データベース接続エラー
- PostgreSQLが起動しているか確認
  ```bash
  # macOS (Homebrew)
  brew services list
  brew services start postgresql

  # Linux
  sudo systemctl status postgresql
  sudo systemctl start postgresql
  ```
- `backend/.env` ファイルの接続情報が正しいか確認
  - **macOS (Homebrew)**: `DB_USER`はシステムユーザー名（例: yukisugo）
  - **Linux**: `DB_USER`は通常`postgres`
  - スクリプトはmacOSを自動検出してユーザー名を設定します
- PostgreSQLにログインできるか確認
  ```bash
  # macOS (Homebrewの場合)
  psql -l

  # または
  psql -U postgres -l
  ```
- 「role "postgres" does not exist」エラーが出る場合
  ```bash
  # 現在のシステムユーザー名を確認
  echo $USER

  # backend/.env の DB_USER をシステムユーザー名に変更
  # DB_USER=postgres → DB_USER=yukisugo （例）
  ```

### フロントエンドからAPIに接続できない
- バックエンドサーバーが起動しているか確認
  ```bash
  curl http://localhost:3000/health
  ```
- CORS設定を確認（backend/src/server.js）
- `frontend/.env` のAPI URLが正しいか確認

### 料金計算が正しく動作しない
- 該当するサービスと料金ルールが登録されているか確認
  ```bash
  psql -U postgres -d calibration_system -c "SELECT * FROM m_services;"
  ```
- 測定範囲や能力値が正しく入力されているか確認
- バックエンドのログを確認（backend/src/server.js）

### tmux/screenがインストールされていない場合
`start-all.sh` はtmuxまたはscreenを使用します。インストールされていない場合：

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt install tmux

# または個別起動を使用
./scripts/start-backend.sh   # ターミナル1
./scripts/start-frontend.sh  # ターミナル2
```

### ポートが既に使用されている
```bash
# ポート3000を使用中のプロセスを確認
lsof -i :3000

# ポート5173を使用中のプロセスを確認
lsof -i :5173

# プロセスを停止（PIDを指定）
kill -9 <PID>
```

## ライセンス

MIT

## 開発者向け情報

詳細な仕様については `specification.md` を参照してください。

#!/bin/bash

# 校正料金自動算出システム - 初回セットアップスクリプト

set -e

echo "=========================================="
echo "校正料金自動算出システム"
echo "初回セットアップ"
echo "=========================================="
echo ""

# プロジェクトのルートディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# 必要なコマンドの確認
echo "必要なツールを確認中..."
MISSING_TOOLS=0

if ! command -v node &> /dev/null; then
    echo "✗ Node.js がインストールされていません"
    MISSING_TOOLS=1
else
    NODE_VERSION=$(node -v)
    echo "✓ Node.js $NODE_VERSION"
fi

if ! command -v npm &> /dev/null; then
    echo "✗ npm がインストールされていません"
    MISSING_TOOLS=1
else
    NPM_VERSION=$(npm -v)
    echo "✓ npm $NPM_VERSION"
fi

if ! command -v psql &> /dev/null; then
    echo "✗ PostgreSQL がインストールされていません"
    MISSING_TOOLS=1
else
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    echo "✓ PostgreSQL $PSQL_VERSION"
fi

if [ $MISSING_TOOLS -eq 1 ]; then
    echo ""
    echo "エラー: 必要なツールがインストールされていません"
    echo "詳細はREADMEを参照してください"
    exit 1
fi

echo ""
echo "=========================================="
echo "[1/3] データベースのセットアップ"
echo "=========================================="
echo ""

read -p "データベースをセットアップしますか？ (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    chmod +x scripts/setup-db.sh
    ./scripts/setup-db.sh
else
    echo "データベースのセットアップをスキップしました"
fi

echo ""
echo "=========================================="
echo "[2/3] バックエンドのセットアップ"
echo "=========================================="
echo ""

cd backend

if [ ! -f .env ]; then
    echo ".env ファイルを作成します..."
    cp .env.example .env

    # macOSの場合、自動的にシステムユーザー名を設定
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS環境を検出しました。DB_USERを自動設定します..."
        sed -i '' "s/DB_USER=postgres/DB_USER=$USER/" .env
    fi

    echo "✓ .env ファイルを作成しました"
    echo ""
    echo "⚠ 重要: backend/.env ファイルを確認してデータベース接続情報を設定してください"
    echo ""
    read -p "今すぐ編集しますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    fi
fi

echo ""
echo "バックエンドの依存関係をインストール中..."
npm install
echo "✓ バックエンドのセットアップ完了"

cd "$PROJECT_ROOT"

echo ""
echo "=========================================="
echo "[3/3] フロントエンドのセットアップ"
echo "=========================================="
echo ""

cd frontend

if [ ! -f .env ]; then
    echo ".env ファイルを作成します..."
    cp .env.example .env
    echo "✓ .env ファイルを作成しました"
fi

echo ""
echo "フロントエンドの依存関係をインストール中..."
npm install
echo "✓ フロントエンドのセットアップ完了"

cd "$PROJECT_ROOT"

echo ""
echo "=========================================="
echo "セットアップが完了しました！"
echo "=========================================="
echo ""
echo "次のコマンドでシステムを起動できます:"
echo ""
echo "  # すべて一度に起動（推奨）"
echo "  ./scripts/start-all.sh"
echo ""
echo "  # または個別に起動"
echo "  ./scripts/start-backend.sh   # ターミナル1"
echo "  ./scripts/start-frontend.sh  # ターミナル2"
echo ""
echo "アクセスURL:"
echo "  フロントエンド: http://localhost:5173"
echo "  バックエンドAPI: http://localhost:3000"
echo ""

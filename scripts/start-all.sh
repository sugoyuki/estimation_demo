#!/bin/bash

# 校正料金自動算出システム - 全体起動スクリプト（開発環境）

set -e

echo "=========================================="
echo "校正料金自動算出システム"
echo "=========================================="
echo ""

# プロジェクトのルートディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# バックエンドの準備
echo "[1/3] バックエンドの準備..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env

    # macOSの場合、自動的にシステムユーザー名を設定
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/DB_USER=postgres/DB_USER=$USER/" .env
        echo "✓ backend/.env ファイルを作成しました。DB_USERは自動的に '$USER' に設定されています。"
    else
        echo "✓ backend/.env ファイルを作成しました。データベース接続情報を確認してください。"
    fi
fi

if [ ! -d "node_modules" ]; then
    echo "バックエンドの依存関係をインストール中..."
    npm install
fi

cd "$PROJECT_ROOT"

# フロントエンドの準備
echo ""
echo "[2/3] フロントエンドの準備..."
cd frontend

if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ ! -d "node_modules" ]; then
    echo "フロントエンドの依存関係をインストール中..."
    npm install
fi

cd "$PROJECT_ROOT"

echo ""
echo "[3/3] サーバーを起動します..."
echo ""
echo "=========================================="
echo "起動情報"
echo "=========================================="
echo "バックエンド: http://localhost:3000"
echo "フロントエンド: http://localhost:5173"
echo ""
echo "終了するには Ctrl+C を押してください"
echo "=========================================="
echo ""

# concurrentlyを使ってフォアグラウンドで起動
npm run dev

#!/bin/bash

# 校正料金自動算出システム - フロントエンド起動スクリプト

set -e

echo "=========================================="
echo "フロントエンドを起動します"
echo "=========================================="
echo ""

cd frontend

# .envファイルの存在確認（オプション）
if [ ! -f .env ]; then
    echo ".env.example から .env を作成します..."
    cp .env.example .env
    echo "✓ .env ファイルを作成しました"
    echo ""
fi

# node_modulesの存在確認
if [ ! -d "node_modules" ]; then
    echo "依存関係をインストールします..."
    npm install
    echo "✓ インストール完了"
    echo ""
fi

echo "フロントエンドを起動します..."
echo "URL: http://localhost:5173"
echo ""
npm run dev

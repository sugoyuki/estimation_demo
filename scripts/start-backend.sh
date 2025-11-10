#!/bin/bash

# 校正料金自動算出システム - バックエンド起動スクリプト

set -e

echo "=========================================="
echo "バックエンドサーバーを起動します"
echo "=========================================="
echo ""

cd backend

# .envファイルの存在確認
if [ ! -f .env ]; then
    echo "⚠ .env ファイルが見つかりません"
    echo ".env.example から .env を作成します..."
    cp .env.example .env

    # macOSの場合、自動的にシステムユーザー名を設定
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS環境を検出しました。DB_USERを自動設定します..."
        sed -i '' "s/DB_USER=postgres/DB_USER=$USER/" .env
    fi

    echo "✓ .env ファイルを作成しました"
    echo ""
    echo "⚠ 重要: .env ファイルを確認してデータベース接続情報を設定してください"
    echo "         macOSの場合、DB_USERは自動的に '$USER' に設定されています"
    echo ""
    read -p "続行しますか？ (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "中止しました"
        exit 1
    fi
fi

# node_modulesの存在確認
if [ ! -d "node_modules" ]; then
    echo "依存関係をインストールします..."
    npm install
    echo "✓ インストール完了"
    echo ""
fi

echo "バックエンドサーバーを起動します..."
echo "URL: http://localhost:3000"
echo ""
npm run dev

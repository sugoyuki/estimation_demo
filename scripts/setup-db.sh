#!/bin/bash

# 校正料金自動算出システム - データベースセットアップスクリプト

set -e

echo "=========================================="
echo "データベースセットアップを開始します"
echo "=========================================="
echo ""

# データベース設定（環境変数または.envから読み込み）
DB_NAME=${DB_NAME:-"calibration_system"}
# macOSのHomebrewでインストールした場合、デフォルトユーザーは現在のシステムユーザー
DB_USER=${DB_USER:-"$USER"}

echo "データベース名: $DB_NAME"
echo "ユーザー名: $DB_USER"
echo ""

# PostgreSQL接続確認
echo "PostgreSQL接続を確認中..."
if ! psql -U "$DB_USER" -d postgres -c '\q' 2>/dev/null; then
    echo "⚠ 'postgres' データベースに接続できません。'template1'を試します..."
    if ! psql -U "$DB_USER" -d template1 -c '\q' 2>/dev/null; then
        echo "✗ エラー: PostgreSQLに接続できません"
        echo ""
        echo "以下を確認してください："
        echo "  1. PostgreSQLが起動しているか: brew services list"
        echo "  2. PostgreSQLを起動: brew services start postgresql@14"
        echo "  3. データベースが初期化されているか"
        echo ""
        exit 1
    fi
    DEFAULT_DB="template1"
else
    DEFAULT_DB="postgres"
fi
echo "✓ PostgreSQL接続成功 (using $DEFAULT_DB)"
echo ""

# データベースが存在するか確認
DB_EXISTS=$(psql -U "$DB_USER" -d "$DEFAULT_DB" -lqt | cut -d \| -f 1 | grep -w "$DB_NAME" | wc -l)

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "データベース '$DB_NAME' を作成します..."
    psql -U "$DB_USER" -d "$DEFAULT_DB" -c "CREATE DATABASE $DB_NAME;"
    echo "✓ データベース作成完了"
else
    echo "⚠ データベース '$DB_NAME' は既に存在します"
    read -p "既存のデータを削除して再作成しますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        psql -U "$DB_USER" -d "$DEFAULT_DB" -c "DROP DATABASE $DB_NAME;"
        psql -U "$DB_USER" -d "$DEFAULT_DB" -c "CREATE DATABASE $DB_NAME;"
        echo "✓ データベース再作成完了"
    fi
fi

echo ""
echo "スキーマ（v2: Excel仕様準拠）を適用します..."
psql -U "$DB_USER" -d "$DB_NAME" -f database/schema_v2.sql
echo "✓ スキーマ適用完了"

echo ""
read -p "テストデータを投入しますか？ (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    psql -U "$DB_USER" -d "$DB_NAME" -f database/seed_v2.sql
    echo "✓ テストデータ投入完了"
fi

echo ""
echo "=========================================="
echo "データベースセットアップが完了しました！"
echo "=========================================="
echo ""
echo "接続情報:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// CSVを読み込んでパースする関数
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  // ヘッダー行を除外
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    // カンマで分割（簡易版、引用符対応なし）
    const columns = line.split(',');
    return columns;
  });
}

// サービスマスタCSVからservice_idのマッピングを作成
function buildServiceMapping(servicesCSV) {
  const mapping = {};
  servicesCSV.forEach((row, index) => {
    const commonCd = row[0].replace(/^﻿/, ''); // BOM除去
    if (commonCd && commonCd !== '共通Cd') {
      // 共通Cd（例: 温度001）からfield_idとfield_numberを計算
      const match = commonCd.match(/^(.+?)(\d+)$/);
      if (match) {
        const fieldName = match[1];
        const fieldNumber = parseInt(match[2], 10);

        // field_nameからfield_idへのマッピング
        const fieldIdMap = {
          '温度': 1,
          '湿度': 2,  // CSVでは温度031-036だが実際は湿度
          '体積': 3,
          '力': 4,
          '圧力': 5,
          '質量': 6
        };

        const field_id = fieldIdMap[fieldName];
        if (field_id) {
          // サービスIDを計算（データベース内のservice_idと一致させる必要がある）
          // 実際のマッピングはデータベースから取得した方が正確
          mapping[commonCd] = { field_id, field_number };
        }
      }
    }
  });
  return mapping;
}

// NULL処理関数
function sqlValue(value) {
  if (value === undefined || value === null || value === '' || value === '-') {
    return 'NULL';
  }
  // 数値の場合
  if (!isNaN(value) && value.trim() !== '') {
    return value;
  }
  // 文字列の場合（シングルクォートをエスケープ）
  return `'${value.replace(/'/g, "''")}'`;
}

// m_fields のINSERT文生成
function generateFieldsSQL() {
  const fields = [
    { field_id: 1, field_name: '温度', revenue_category: '熱学', rule_table_type: 'general' },
    { field_id: 2, field_name: '湿度', revenue_category: '熱学', rule_table_type: 'general' },
    { field_id: 3, field_name: '体積', revenue_category: '力学', rule_table_type: 'general' },
    { field_id: 4, field_name: '力', revenue_category: '力学', rule_table_type: 'force' },
    { field_id: 5, field_name: '圧力', revenue_category: '力学', rule_table_type: 'general' },
    { field_id: 6, field_name: '質量', revenue_category: '力学', rule_table_type: 'general' }
  ];

  let sql = '\n-- ===================================\n';
  sql += '-- M_Fields: 分野マスタ\n';
  sql += '-- ===================================\n\n';

  fields.forEach(f => {
    sql += `INSERT INTO m_fields (field_id, field_name, revenue_category, rule_table_type, is_active) VALUES (${f.field_id}, '${f.field_name}', '${f.revenue_category}', '${f.rule_table_type}', true);\n`;
  });

  return sql;
}

// m_services のINSERT文生成（データベースからエクスポート済みのデータを使用）
function generateServicesSQL() {
  const services = [
    // データベースから取得したデータを直接記述（87件）
    // ここでは簡略化のため、実際のデータベースからダンプした内容を使用
  ];

  let sql = '\n-- ===================================\n';
  sql += '-- M_Services: サービスマスタ (87件)\n';
  sql += '-- ===================================\n\n';
  sql += '-- Note: 実際のデータはデータベースからダンプしたものを使用\n';

  return sql;
}

console.log('CSV parsing script ready. This is a template for generating seed SQL.');
console.log('Due to complexity, using pg_dump approach instead...');

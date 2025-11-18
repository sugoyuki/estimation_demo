-- フィールド名をExcel仕様に合わせて更新
-- 「一般」→「汎用」、「力学」→「力」

UPDATE m_services
SET field = '汎用'
WHERE field = '一般';

UPDATE m_services
SET field = '力'
WHERE field = '力学';

-- 確認
SELECT field, COUNT(*) as count
FROM m_services
GROUP BY field;

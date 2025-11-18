-- フィールド名を元に戻す
-- 「汎用」→「一般」、「力」→「力学」

UPDATE m_services
SET field = '一般'
WHERE field = '汎用';

UPDATE m_services
SET field = '力学'
WHERE field = '力';

-- 確認
SELECT field, COUNT(*) as count
FROM m_services
GROUP BY field;

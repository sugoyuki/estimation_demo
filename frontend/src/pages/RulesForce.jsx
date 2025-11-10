import React, { useState, useEffect } from 'react';
import { rulesForceApi, servicesApi } from '../api/services';

function RulesForce() {
  const [rules, setRules] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    service_id: '',
    field_cd: '',
    range1_name: '荷重',
    range1_min: '',
    range1_min_unit: 'N',
    range1_min_included: true,
    range1_max: '',
    range1_max_unit: 'N',
    range1_max_included: true,
    range2_name: '荷重方向',
    range2_value: '',
    base_fee: 0,
    point_fee: 0,
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesRes, servicesRes] = await Promise.all([
        rulesForceApi.getAll(),
        servicesApi.getAll({ field: '力学' })
      ]);
      setRules(rulesRes.data.data || []);
      setServices(servicesRes.data.data || []);
      setError(null);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        range1_min: formData.range1_min ? parseFloat(formData.range1_min) : null,
        range1_max: formData.range1_max ? parseFloat(formData.range1_max) : null,
        base_fee: parseFloat(formData.base_fee),
        point_fee: parseFloat(formData.point_fee)
      };

      if (editingId) {
        await rulesForceApi.update(editingId, data);
      } else {
        await rulesForceApi.create(data);
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert('保存に失敗しました: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleEdit = (rule) => {
    setFormData({
      service_id: rule.service_id,
      field_cd: rule.field_cd || '',
      range1_name: rule.range1_name || '荷重',
      range1_min: rule.range1_min || '',
      range1_min_unit: rule.range1_min_unit || 'N',
      range1_min_included: rule.range1_min_included !== false,
      range1_max: rule.range1_max || '',
      range1_max_unit: rule.range1_max_unit || 'N',
      range1_max_included: rule.range1_max_included !== false,
      range2_name: rule.range2_name || '荷重方向',
      range2_value: rule.range2_value || '',
      base_fee: rule.base_fee || 0,
      point_fee: rule.point_fee,
      is_active: rule.is_active
    });
    setEditingId(rule.rule_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('このルールを削除してもよろしいですか？')) {
      return;
    }

    try {
      await rulesForceApi.delete(id);
      fetchData();
    } catch (err) {
      alert('削除に失敗しました');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      service_id: '',
      field_cd: '',
      range1_name: '荷重',
      range1_min: '',
      range1_min_unit: 'N',
      range1_min_included: true,
      range1_max: '',
      range1_max_unit: 'N',
      range1_max_included: true,
      range2_name: '荷重方向',
      range2_value: '',
      base_fee: 0,
      point_fee: 0,
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatRange1 = (min, max, minUnit, maxUnit, minIncluded, maxIncluded) => {
    if (!min && !max) return 'N/A';
    const minBracket = minIncluded ? '[' : '(';
    const maxBracket = maxIncluded ? ']' : ')';
    const minStr = min ? `${min}${minUnit || ''}` : '-∞';
    const maxStr = max ? `${max}${maxUnit || ''}` : '∞';
    return `${minBracket}${minStr}, ${maxStr}${maxBracket}`;
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rules-force">
      <div className="page-header">
        <h1>力学分野ルール管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'フォームを閉じる' : '新規追加'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>{editingId ? 'ルール編集' : '新規ルール追加'}</h3>

          <div className="form-group">
            <label>サービス *</label>
            <select
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              required
            >
              <option value="">選択してください</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.equipment_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>分野Cd</label>
            <input
              type="text"
              value={formData.field_cd}
              onChange={(e) => setFormData({ ...formData, field_cd: e.target.value })}
              placeholder="例: 力1"
            />
          </div>

          <fieldset className="form-section">
            <legend>範囲1（荷重など）</legend>

            <div className="form-group">
              <label>範囲1名称</label>
              <input
                type="text"
                value={formData.range1_name}
                onChange={(e) => setFormData({ ...formData, range1_name: e.target.value })}
                placeholder="荷重"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>最小値</label>
                <input
                  type="number"
                  step="any"
                  value={formData.range1_min}
                  onChange={(e) => setFormData({ ...formData, range1_min: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>単位</label>
                <input
                  type="text"
                  value={formData.range1_min_unit}
                  onChange={(e) => setFormData({ ...formData, range1_min_unit: e.target.value })}
                  placeholder="N"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.range1_min_included}
                    onChange={(e) => setFormData({ ...formData, range1_min_included: e.target.checked })}
                  />
                  含む (>=)
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>最大値</label>
                <input
                  type="number"
                  step="any"
                  value={formData.range1_max}
                  onChange={(e) => setFormData({ ...formData, range1_max: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>単位</label>
                <input
                  type="text"
                  value={formData.range1_max_unit}
                  onChange={(e) => setFormData({ ...formData, range1_max_unit: e.target.value })}
                  placeholder="N"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.range1_max_included}
                    onChange={(e) => setFormData({ ...formData, range1_max_included: e.target.checked })}
                  />
                  含む (&lt;=)
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>範囲2（荷重方向など）</legend>

            <div className="form-group">
              <label>範囲2名称</label>
              <input
                type="text"
                value={formData.range2_name}
                onChange={(e) => setFormData({ ...formData, range2_name: e.target.value })}
                placeholder="荷重方向"
              />
            </div>

            <div className="form-group">
              <label>範囲2値</label>
              <select
                value={formData.range2_value}
                onChange={(e) => setFormData({ ...formData, range2_value: e.target.value })}
              >
                <option value="">選択してください</option>
                <option value="片方向">片方向</option>
                <option value="両方向">両方向</option>
                <option value="-">-（該当なし）</option>
              </select>
            </div>
          </fieldset>

          <div className="form-group">
            <label>基本料金 *</label>
            <input
              type="number"
              value={formData.base_fee}
              onChange={(e) => setFormData({ ...formData, base_fee: e.target.value })}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>点数料金 *</label>
            <input
              type="number"
              value={formData.point_fee}
              onChange={(e) => setFormData({ ...formData, point_fee: e.target.value })}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              有効
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '更新' : '追加'}
            </button>
            <button type="button" onClick={resetForm} className="btn">
              キャンセル
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>分野Cd</th>
              <th>サービス</th>
              <th>範囲1名称</th>
              <th>範囲1</th>
              <th>範囲2名称</th>
              <th>範囲2値</th>
              <th>基本料金</th>
              <th>点数料金</th>
              <th>有効</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.rule_id}>
                <td>{rule.rule_id}</td>
                <td>{rule.field_cd || '-'}</td>
                <td>{rule.service?.equipment_name || 'N/A'}</td>
                <td>{rule.range1_name || '-'}</td>
                <td>
                  {formatRange1(
                    rule.range1_min,
                    rule.range1_max,
                    rule.range1_min_unit,
                    rule.range1_max_unit,
                    rule.range1_min_included,
                    rule.range1_max_included
                  )}
                </td>
                <td>{rule.range2_name || '-'}</td>
                <td>{rule.range2_value || '-'}</td>
                <td>¥{parseFloat(rule.base_fee || 0).toLocaleString()}</td>
                <td>¥{parseFloat(rule.point_fee || 0).toLocaleString()}</td>
                <td>{rule.is_active ? '有効' : '無効'}</td>
                <td>
                  <button onClick={() => handleEdit(rule)} className="btn btn-sm">
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(rule.rule_id)}
                    className="btn btn-sm btn-danger"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RulesForce;

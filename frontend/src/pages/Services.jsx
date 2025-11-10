import React, { useState, useEffect } from 'react';
import { servicesApi } from '../api/services';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    category: '一般',
    base_fee: 0,
    requires_point_calc: false,
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.getAll();
      setServices(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('サービス一覧の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await servicesApi.update(editingId, formData);
      } else {
        await servicesApi.create(formData);
      }
      fetchServices();
      resetForm();
    } catch (err) {
      alert('保存に失敗しました');
      console.error(err);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      service_name: service.service_name,
      category: service.category,
      base_fee: service.base_fee,
      requires_point_calc: service.requires_point_calc,
      is_active: service.is_active
    });
    setEditingId(service.service_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('このサービスを削除してもよろしいですか？')) {
      return;
    }

    try {
      await servicesApi.delete(id);
      fetchServices();
    } catch (err) {
      alert('削除に失敗しました');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      category: '一般',
      base_fee: 0,
      requires_point_calc: false,
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services">
      <div className="page-header">
        <h1>サービスマスタ</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'フォームを閉じる' : '新規追加'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>{editingId ? 'サービス編集' : '新規サービス追加'}</h3>

          <div className="form-group">
            <label>サービス名</label>
            <input
              type="text"
              value={formData.service_name}
              onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>分野</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="一般">一般</option>
              <option value="力学">力学</option>
            </select>
          </div>

          <div className="form-group">
            <label>基本料金</label>
            <input
              type="number"
              value={formData.base_fee}
              onChange={(e) => setFormData({ ...formData, base_fee: parseFloat(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.requires_point_calc}
                onChange={(e) => setFormData({ ...formData, requires_point_calc: e.target.checked })}
              />
              点数計算が必要
            </label>
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

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>サービス名</th>
            <th>分野</th>
            <th>基本料金</th>
            <th>点数計算</th>
            <th>有効</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.service_id}>
              <td>{service.service_id}</td>
              <td>{service.service_name}</td>
              <td>{service.category}</td>
              <td>¥{parseFloat(service.base_fee || 0).toLocaleString()}</td>
              <td>{service.requires_point_calc ? '必要' : '不要'}</td>
              <td>{service.is_active ? '有効' : '無効'}</td>
              <td>
                <button onClick={() => handleEdit(service)} className="btn btn-sm">
                  編集
                </button>
                <button
                  onClick={() => handleDelete(service.service_id)}
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
  );
}

export default Services;

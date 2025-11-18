import React, { useState, useEffect } from 'react';
import { servicesApi } from '../api/services';

interface FieldInfo {
  field_id: number;
  field_name: string;
  revenue_category: string;
  rule_table_type: string;
}

interface Service {
  service_id: number;
  field_id: number;
  field_number: number;
  field: string;
  equipment_name: string;
  equipment_type1: string;
  equipment_type2: string;
  combination: string;
  main_option: string;
  option_name: string;
  calibration_item: string;
  method: string;
  is_active: boolean;
  fieldInfo?: FieldInfo;
  created_at?: string;
  updated_at?: string;
}

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    field_id: 1,
    field_number: 1,
    field: '一般',
    equipment_name: '',
    equipment_type1: '',
    equipment_type2: '',
    combination: '',
    main_option: '',
    option_name: '',
    calibration_item: '',
    method: '',
    is_active: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const handleEdit = (service: Service) => {
    setFormData({
      field_id: service.field_id || 1,
      field_number: service.field_number || 1,
      field: service.field || '一般',
      equipment_name: service.equipment_name || '',
      equipment_type1: service.equipment_type1 || '',
      equipment_type2: service.equipment_type2 || '',
      combination: service.combination || '',
      main_option: service.main_option || '',
      option_name: service.option_name || '',
      calibration_item: service.calibration_item || '',
      method: service.method || '',
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
      field_id: 1,
      field_number: 1,
      field: '一般',
      equipment_name: '',
      equipment_type1: '',
      equipment_type2: '',
      combination: '',
      main_option: '',
      option_name: '',
      calibration_item: '',
      method: '',
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
            <label>分野ID *</label>
            <input
              type="number"
              value={formData.field_id}
              onChange={(e) => setFormData({ ...formData, field_id: parseInt(e.target.value) })}
              required
            />
            <small>1=温度, 2=湿度, 3=体積, 4=力, 5=圧力, 6=質量</small>
          </div>

          <div className="form-group">
            <label>分野内番号 *</label>
            <input
              type="number"
              value={formData.field_number}
              onChange={(e) => setFormData({ ...formData, field_number: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label>分野</label>
            <select
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            >
              <option value="一般">一般</option>
              <option value="力学">力学</option>
            </select>
          </div>

          <div className="form-group">
            <label>機器名</label>
            <input
              type="text"
              value={formData.equipment_name}
              onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>機器種類1</label>
            <input
              type="text"
              value={formData.equipment_type1}
              onChange={(e) => setFormData({ ...formData, equipment_type1: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>機器種類2</label>
            <input
              type="text"
              value={formData.equipment_type2}
              onChange={(e) => setFormData({ ...formData, equipment_type2: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>組み合わせ</label>
            <input
              type="text"
              value={formData.combination}
              onChange={(e) => setFormData({ ...formData, combination: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>メイン・オプション</label>
            <input
              type="text"
              value={formData.main_option}
              onChange={(e) => setFormData({ ...formData, main_option: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>オプション名</label>
            <input
              type="text"
              value={formData.option_name}
              onChange={(e) => setFormData({ ...formData, option_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>校正項目</label>
            <input
              type="text"
              value={formData.calibration_item}
              onChange={(e) => setFormData({ ...formData, calibration_item: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>手法</label>
            <input
              type="text"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
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

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>分野名</th>
            <th>分野番号</th>
            <th>収入区分</th>
            <th>ルール種別</th>
            <th>機器名</th>
            <th>機器種類1</th>
            <th>機器種類2</th>
            <th>組み合わせ</th>
            <th>メイン・オプション</th>
            <th>オプション名</th>
            <th>校正項目</th>
            <th>手法</th>
            <th>有効</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.service_id}>
              <td>{service.service_id}</td>
              <td>{service.fieldInfo?.field_name || '-'}</td>
              <td>{service.field_number}</td>
              <td>{service.fieldInfo?.revenue_category || '-'}</td>
              <td>{service.field}</td>
              <td>{service.equipment_name}</td>
              <td>{service.equipment_type1}</td>
              <td>{service.equipment_type2}</td>
              <td>{service.combination}</td>
              <td>{service.main_option}</td>
              <td>{service.option_name}</td>
              <td>{service.calibration_item}</td>
              <td>{service.method}</td>
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

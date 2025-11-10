import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calibrationApi, servicesApi } from '../api/services';

function EstimateNew() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 見積基本情報
  const [formData, setFormData] = useState({
    request_number: '',
    customer_name: '',
    request_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // 明細リスト
  const [items, setItems] = useState([]);

  // 新規明細フォーム
  const [newItem, setNewItem] = useState({
    service_id: '',
    item_name: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    quantity: 1,
    point_count: '',
    measurement_range_min: '',
    measurement_range_max: '',
    measurement_unit: '',
    capacity_value: '',
    capacity_unit: '',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll({ is_active: true });
      setServices(response.data.data || []);
    } catch (err) {
      console.error('サービス一覧の取得に失敗しました', err);
    }
  };

  const handleAddItem = () => {
    if (!newItem.service_id || !newItem.item_name) {
      alert('サービスと校正品名は必須です');
      return;
    }

    const selectedService = services.find(s => s.service_id === parseInt(newItem.service_id));

    setItems([...items, {
      ...newItem,
      service_name: selectedService?.service_name || '',
      temp_id: Date.now() // 一時ID
    }]);

    // フォームリセット
    setNewItem({
      service_id: '',
      item_name: '',
      manufacturer: '',
      model_number: '',
      serial_number: '',
      quantity: 1,
      point_count: '',
      measurement_range_min: '',
      measurement_range_max: '',
      measurement_unit: '',
      capacity_value: '',
      capacity_unit: '',
      notes: ''
    });
  };

  const handleRemoveItem = (tempId) => {
    setItems(items.filter(item => item.temp_id !== tempId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.request_number || !formData.customer_name) {
      alert('見積番号と顧客名は必須です');
      return;
    }

    if (items.length === 0) {
      alert('明細を少なくとも1件追加してください');
      return;
    }

    try {
      setLoading(true);

      // 明細データを整形
      const formattedItems = items.map(item => ({
        service_id: parseInt(item.service_id),
        item_name: item.item_name,
        manufacturer: item.manufacturer || null,
        model_number: item.model_number || null,
        serial_number: item.serial_number || null,
        quantity: parseInt(item.quantity) || 1,
        point_count: item.point_count ? parseInt(item.point_count) : null,
        measurement_range_min: item.measurement_range_min ? parseFloat(item.measurement_range_min) : null,
        measurement_range_max: item.measurement_range_max ? parseFloat(item.measurement_range_max) : null,
        measurement_unit: item.measurement_unit || null,
        capacity_value: item.capacity_value ? parseFloat(item.capacity_value) : null,
        capacity_unit: item.capacity_unit || null,
        notes: item.notes || null
      }));

      const requestData = {
        ...formData,
        items: formattedItems
      };

      const response = await calibrationApi.createRequest(requestData);
      alert('見積を作成しました');
      navigate(`/estimates/${response.data.data.request_id}`);
    } catch (err) {
      console.error('見積作成エラー:', err);
      alert(`見積作成に失敗しました: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.service_id === parseInt(newItem.service_id));

  return (
    <div className="estimate-new">
      <div className="page-header">
        <h1>新規見積作成</h1>
        <button onClick={() => navigate('/estimates')} className="btn">
          キャンセル
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 基本情報 */}
        <div className="form-card">
          <h2>基本情報</h2>
          <div className="form-group">
            <label>見積番号 *</label>
            <input
              type="text"
              value={formData.request_number}
              onChange={(e) => setFormData({ ...formData, request_number: e.target.value })}
              placeholder="例: EST-2025-003"
              required
            />
          </div>
          <div className="form-group">
            <label>顧客名 *</label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="例: 株式会社サンプル"
              required
            />
          </div>
          <div className="form-group">
            <label>依頼日 *</label>
            <input
              type="date"
              value={formData.request_date}
              onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>備考</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              placeholder="特記事項があれば入力してください"
            />
          </div>
        </div>

        {/* 明細追加フォーム */}
        <div className="form-card">
          <h2>明細追加</h2>
          <div className="form-group">
            <label>サービス *</label>
            <select
              value={newItem.service_id}
              onChange={(e) => setNewItem({ ...newItem, service_id: e.target.value })}
            >
              <option value="">選択してください</option>
              {services.map(service => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_name} ({service.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>校正品名 *</label>
              <input
                type="text"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                placeholder="例: デジタルトルクレンチ"
              />
            </div>
            <div className="form-group">
              <label>メーカー</label>
              <input
                type="text"
                value={newItem.manufacturer}
                onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                placeholder="例: TOHNICHI"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>型式</label>
              <input
                type="text"
                value={newItem.model_number}
                onChange={(e) => setNewItem({ ...newItem, model_number: e.target.value })}
                placeholder="例: CEM100N3X15D"
              />
            </div>
            <div className="form-group">
              <label>シリアル番号</label>
              <input
                type="text"
                value={newItem.serial_number}
                onChange={(e) => setNewItem({ ...newItem, serial_number: e.target.value })}
                placeholder="例: S12345"
              />
            </div>
          </div>

          {selectedService && selectedService.requires_point_calc && (
            <>
              <div className="form-group">
                <label>点数 *</label>
                <input
                  type="number"
                  value={newItem.point_count}
                  onChange={(e) => setNewItem({ ...newItem, point_count: e.target.value })}
                  placeholder="例: 5"
                  min="1"
                />
              </div>

              {selectedService.category === '一般' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>測定範囲 最小値</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.measurement_range_min}
                      onChange={(e) => setNewItem({ ...newItem, measurement_range_min: e.target.value })}
                      placeholder="例: 10"
                    />
                  </div>
                  <div className="form-group">
                    <label>測定範囲 最大値</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.measurement_range_max}
                      onChange={(e) => setNewItem({ ...newItem, measurement_range_max: e.target.value })}
                      placeholder="例: 100"
                    />
                  </div>
                  <div className="form-group">
                    <label>単位</label>
                    <input
                      type="text"
                      value={newItem.measurement_unit}
                      onChange={(e) => setNewItem({ ...newItem, measurement_unit: e.target.value })}
                      placeholder="例: N·m"
                    />
                  </div>
                </div>
              )}

              {selectedService.category === '力学' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>能力値</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.capacity_value}
                      onChange={(e) => setNewItem({ ...newItem, capacity_value: e.target.value })}
                      placeholder="例: 100"
                    />
                  </div>
                  <div className="form-group">
                    <label>能力単位</label>
                    <input
                      type="text"
                      value={newItem.capacity_unit}
                      onChange={(e) => setNewItem({ ...newItem, capacity_unit: e.target.value })}
                      placeholder="例: kN"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>数量</label>
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              min="1"
            />
          </div>

          <button type="button" onClick={handleAddItem} className="btn btn-primary">
            明細に追加
          </button>
        </div>

        {/* 追加済み明細一覧 */}
        {items.length > 0 && (
          <div className="form-card">
            <h2>追加済み明細（{items.length}件）</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>サービス</th>
                  <th>校正品名</th>
                  <th>メーカー</th>
                  <th>型式</th>
                  <th>点数</th>
                  <th>数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.temp_id}>
                    <td>{index + 1}</td>
                    <td>{item.service_name}</td>
                    <td>{item.item_name}</td>
                    <td>{item.manufacturer || '-'}</td>
                    <td>{item.model_number || '-'}</td>
                    <td>{item.point_count || '-'}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.temp_id)}
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
        )}

        {/* 送信ボタン */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || items.length === 0}>
            {loading ? '作成中...' : '見積を作成'}
          </button>
          <button type="button" onClick={() => navigate('/estimates')} className="btn">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export default EstimateNew;

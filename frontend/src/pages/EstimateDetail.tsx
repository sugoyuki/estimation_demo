import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calibrationApi } from '../api/services';

function EstimateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await calibrationApi.getRequestById(id);
      setRequest(response.data.data);
      setError(null);
    } catch (err) {
      setError('見積の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!request) return <div>見積が見つかりません</div>;

  return (
    <div className="estimate-detail">
      <div className="page-header">
        <h1>見積詳細</h1>
        <button onClick={() => navigate('/estimates')} className="btn">
          一覧に戻る
        </button>
      </div>

      <div className="form-card">
        <h2>基本情報</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>見積番号</label>
            <p>{request.request_number}</p>
          </div>
          <div className="info-item">
            <label>顧客名</label>
            <p>{request.customer_name}</p>
          </div>
          <div className="info-item">
            <label>依頼日</label>
            <p>{request.request_date}</p>
          </div>
          <div className="info-item">
            <label>ステータス</label>
            <p>
              <span className={`status status-${request.status}`}>
                {request.status}
              </span>
            </p>
          </div>
          {request.notes && (
            <div className="info-item full-width">
              <label>備考</label>
              <p>{request.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="form-card">
        <h2>校正明細</h2>
        {!request.items || request.items.length === 0 ? (
          <p>明細がありません</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>サービス名</th>
                <th>校正品名</th>
                <th>メーカー</th>
                <th>型式</th>
                <th>点数</th>
                <th>数量</th>
                <th>基本料金</th>
                <th>点数料金</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              {request.items.map((item, index) => (
                <tr key={item.item_id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.service?.common_field && item.service?.common_number &&
                      `[${item.service.common_field} ${item.service.common_number}] `}
                    {item.service?.equipment_name || '-'}
                  </td>
                  <td>{item.item_name}</td>
                  <td>{item.manufacturer || '-'}</td>
                  <td>{item.model_number || '-'}</td>
                  <td>{item.point_count || '-'}</td>
                  <td>{item.quantity}</td>
                  <td>¥{parseFloat(item.base_fee || 0).toLocaleString()}</td>
                  <td>¥{parseFloat(item.point_fee || 0).toLocaleString()}</td>
                  <td>¥{parseFloat(item.subtotal || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="9" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  合計金額
                </td>
                <td style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  ¥{parseFloat(request.total_amount || 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {request.items && request.items.length > 0 && (
        <div className="form-card">
          <h2>明細詳細情報</h2>
          {request.items.map((item, index) => (
            <div key={item.item_id} className="item-detail-card">
              <h3>明細 #{index + 1}: {item.item_name}</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>シリアル番号</label>
                  <p>{item.serial_number || '-'}</p>
                </div>
                {item.measurement_range_min !== null && (
                  <>
                    <div className="info-item">
                      <label>測定範囲</label>
                      <p>
                        {item.measurement_range_min} 〜 {item.measurement_range_max}{' '}
                        {item.measurement_unit}
                      </p>
                    </div>
                  </>
                )}
                {item.capacity_value !== null && (
                  <>
                    <div className="info-item">
                      <label>能力値</label>
                      <p>
                        {item.capacity_value} {item.capacity_unit}
                      </p>
                    </div>
                  </>
                )}
                {item.notes && (
                  <div className="info-item full-width">
                    <label>備考</label>
                    <p>{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EstimateDetail;

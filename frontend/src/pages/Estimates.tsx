import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calibrationApi } from '../api/services';

function Estimates() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await calibrationApi.getAllRequests();
      setRequests(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('見積一覧の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('この見積を削除してもよろしいですか？')) {
      return;
    }

    try {
      await calibrationApi.deleteRequest(id);
      fetchRequests();
    } catch (err) {
      alert('削除に失敗しました');
      console.error(err);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="estimates">
      <div className="page-header">
        <h1>見積管理</h1>
        <Link to="/estimates/new" className="btn btn-primary">
          新規見積作成
        </Link>
      </div>

      {requests.length === 0 ? (
        <p>見積データがありません</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>見積番号</th>
              <th>顧客名</th>
              <th>依頼日</th>
              <th>合計金額</th>
              <th>ステータス</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.request_id}>
                <td>{request.request_number}</td>
                <td>{request.customer_name}</td>
                <td>{request.request_date}</td>
                <td>¥{parseFloat(request.total_amount || 0).toLocaleString()}</td>
                <td>
                  <span className={`status status-${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <Link to={`/estimates/${request.request_id}`} className="btn btn-sm">
                    詳細
                  </Link>
                  <button
                    onClick={() => handleDelete(request.request_id)}
                    className="btn btn-sm btn-danger"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Estimates;

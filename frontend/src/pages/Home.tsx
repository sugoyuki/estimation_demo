import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>校正料金自動算出システム</h1>
      <p>機器校正の見積作成時に料金を自動算出するシステムです</p>

      <div className="menu-grid">
        <Link to="/estimates" className="menu-card">
          <h2>見積管理</h2>
          <p>見積の作成・参照・編集を行います</p>
        </Link>

        <Link to="/services" className="menu-card">
          <h2>サービスマスタ</h2>
          <p>校正サービスの管理</p>
        </Link>

        <Link to="/rules/general" className="menu-card">
          <h2>一般分野ルール</h2>
          <p>一般分野の料金ルール管理</p>
        </Link>

        <Link to="/rules/force" className="menu-card">
          <h2>力学分野ルール</h2>
          <p>力学分野の料金ルール管理</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;

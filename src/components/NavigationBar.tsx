import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthNavControls from './AuthNavControls'; // AuthNavControlsコンポーネントをインポート
import './NavigationBar.css'; // スタイルシートをインポート

const NavigationBar: React.FC = () => {
  const { isAuthenticated } = useAuth(); // isAuthenticatedのみ必要

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DiaryNote</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated && <Link to="/post">Home</Link>} {/* 認証されている場合のみHomeボタンを表示 */}
        <Link to="/view">View</Link>
      </div>
      <AuthNavControls /> {/* AuthNavControlsコンポーネントをレンダリング */}
    </nav>
  );
};

export default NavigationBar;

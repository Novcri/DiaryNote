import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import LoginForm from './LoginForm';

const AuthNavControls: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/view');
  }, [logout, navigate]);

  const handleLoginClick = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsLoginModalOpen(false);
    navigate('/post');
  }, [navigate]);

  return (
    <div className="navbar-auth">
      {isAuthenticated ? (
        <>
          <span>ようこそ、{user?.name || user?.email}</span>
          <button onClick={handleLogout}>ログアウト</button>
        </>
      ) : (
        <button onClick={handleLoginClick}>ログイン</button>
      )}

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="ログイン">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </Modal>
    </div>
  );
};

export default AuthNavControls;
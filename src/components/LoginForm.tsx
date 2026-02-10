import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css'; // スタイルシートをインポート

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        onLoginSuccess?.(); // ログイン成功時にコールバックを呼び出す
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('ログイン中にエラーが発生しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">メールアドレス:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">パスワード:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="login-button">ログイン</button>
    </form>
  );
};

export default LoginForm;
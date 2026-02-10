import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, type User } from '../api'; // apiLoginとしてインポート

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>; // Promiseを返すように変更
  logout: () => void;
  user: User | null; // ログインユーザー情報を追加
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // ユーザー情報を保持

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(email, password); // APIのlogin関数を呼び出す
      if (response.message === 'Login successful' && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        return true;
      }
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

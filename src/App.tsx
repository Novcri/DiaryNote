import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import HomeRedirector from './components/HomeRedirector';
import { AuthProvider, useAuth } from './context/AuthContext';
import PostPage from './pages/PostPage';
import ViewOnlyPage from './pages/ViewOnlyPage';
import ErrorPage from './pages/ErrorPage'; // ErrorPageをインポート
import NavigationBar from './components/NavigationBar'; // NavigationBarをインポート
import { apiClient } from './api'; // apiClientをインポート
import type { AxiosError, AxiosResponse } from 'axios'; // Axiosの型をタイプオンリーインポート
import './style.css';

// 認証が必要なルートを保護するコンポーネント
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/view" replace />;
};

function App() {
  const navigate = useNavigate(); // useNavigateフックを初期化

  useEffect(() => {
    // レスポンスインターセプターを設定
    const interceptor = apiClient.interceptors.response.use(
      (response: AxiosResponse) => response, // responseに型アノテーションを追加
      (error: AxiosError) => { // errorに型アノテーションを追加
        // サーバーからの応答がなく、ネットワークエラーの場合
        if (!error.response) {
          navigate('/error');
        }
        // 5xxエラーなどのサーバーエラーの場合もエラーページへ
        // else if (error.response.status >= 500) {
        //   navigate('/error');
        // }
        return Promise.reject(error);
      }
    );

    // クリーンアップ関数
    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [navigate]); // navigateが変更されたときに再実行

  return (
      <AuthProvider>
        {/* NavigationBarはAuthProvider内で、Routesの外に配置 */}
        <NavigationBar />
        <Routes>
          {/* ViewOnlyPageは認証不要 */}
          <Route path="/view" element={<ViewOnlyPage />} />
          {/* PostPageは認証が必要 */}
          <Route
            path="/post"
            element={
              <PrivateRoute>
                <PostPage />
              </PrivateRoute>
            }
          />
          {/* ルートパスへのアクセスはPostPageにリダイレクト。
              isAuthenticated が false の場合は PrivateRoute で /login へリダイレクトされる */}
          <Route path="/" element={<HomeRedirector />} />
          <Route path="/error" element={<ErrorPage />} /> {/* エラーページを追加 */}
        </Routes>
      </AuthProvider>
  );
}

export default App;
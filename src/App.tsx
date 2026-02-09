import { Routes, Route, Link, useLocation } from 'react-router-dom';
import PostPage from './pages/PostPage';
import ViewOnlyPage from './pages/ViewOnlyPage';
import ErrorPage from './pages/ErrorPage';
import './style.css';

function App() {
  const location = useLocation();
  const isErrorPage = location.pathname === '/error';

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/" className={isErrorPage ? 'disabled-link' : ''}>Home (Post)</Link>
          </li>
          <li>
            <Link to="/view" className={isErrorPage ? 'disabled-link' : ''}>View-Only</Link>
          </li>
        </ul>
      </nav>



      <Routes>
        <Route path="/" element={<PostPage />} />
        <Route path="/view" element={<ViewOnlyPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;

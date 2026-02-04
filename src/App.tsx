import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostPage from './pages/PostPage';
import ViewOnlyPage from './pages/ViewOnlyPage';
import './style.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home (Post)</Link>
            </li>
            <li>
              <Link to="/view">View-Only</Link>
            </li>
          </ul>
        </nav>



        <Routes>
          <Route path="/" element={<PostPage />} />
          <Route path="/view" element={<ViewOnlyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

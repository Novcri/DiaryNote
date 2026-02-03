import { useState, useEffect } from 'react';
import { type Post } from '../api';
import { fetchPosts } from '../utils/fetchPosts';
import '../style.css';

function ViewOnlyPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts(setPosts);
  }, []);

  return (
    <div className="container">
      <h1>One's Word's (Read-Only)</h1>
      <div className="post-list">
        {posts.length ? posts.map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-text">{post.text}</div>
                          <div className="post-footer">
                            <div>❤️ {post.likes}</div>
                            <div className={`genre-tag ${post.genre === '技術' ? 'genre-tech' : post.genre === '日常' ? 'genre-daily' : 'genre-other'}`}>
                              {post.genre}
                            </div>
                            <div className="timestamp">{post.timestamp}</div>
                          </div>          </div>
        )) : <div className="post-item">NO DATA</div>}
      </div>
    </div>
  );
}

export default ViewOnlyPage;

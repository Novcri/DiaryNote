import { useState, useEffect } from 'react';
import { getFormattedTimestamp } from './utils/date';
import LikeButton from './components/LikeButton';
import { getPosts, createPost, updateLikes, type Post } from './api';
import './style.css';

function App() {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  async function addPost() {
    if (newPost.trim() !== '') {
      try {
        const response = await createPost({
          text: newPost.trim(),
          timestamp: getFormattedTimestamp(),
          likes: 0,
        });
        setPosts([response.data, ...posts]);
        setNewPost('');
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleUpdateLikes = async (postId: number, newLikes: number) => {
    try {
      await updateLikes(postId, newLikes);
      setPosts(posts.map(p => (p.id === postId ? { ...p, likes: newLikes } : p)));
    } catch (error) {
      console.error('Failed to update likes:', error);
      // Optionally revert the state change on failure
      setPosts(posts.map(p => p)); // This forces a re-render but doesn't change data
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h1>One's Word's</h1>
      <div className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
        ></textarea>
        <button onClick={addPost}>Post</button>
      </div>
      <div className="post-list">
        {posts.length ? posts.map((post) => (
          <div key={post.id} className="post-item">
            <div>{post.text}</div>
            <div className="post-footer">
              <LikeButton
                initialLikes={post.likes}
                postId={post.id}
                onUpdateLikes={handleUpdateLikes}
              />
              <div className="timestamp">{post.timestamp}</div>
            </div>
          </div>
        )) : <div className="post-item">NO DATA</div>}
      </div>
    </div>
  );
}

export default App;

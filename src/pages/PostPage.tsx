import { useState, useEffect } from 'react';
import LikeButton from '../components/LikeButton';
import { type Post } from '../api';
import { fetchPosts } from '../utils/fetchPosts';
import { addPost } from '../utils/addPost';
import { handleUpdateLikes } from '../utils/handleUpdateLikes';
import '../style.css';

function PostPage() {
  const [newPost, setNewPost] = useState('');
  const [newGenre, setNewGenre] = useState('技術');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts(setPosts);
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
        <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)}>

          <option value="技術">技術</option>
          <option value="日常">日常</option>
        </select>
        <button onClick={() => addPost(newPost, newGenre, setNewPost, setNewGenre, posts, setPosts)}>Post</button>
      </div>
      <div className="post-list">
        {posts.length ? posts.map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-text">{post.text}</div>
            <div className="post-footer">
              <LikeButton
                initialLikes={post.likes}
                postId={post.id}
                onUpdateLikes={(postId, newLikes) => handleUpdateLikes(postId, newLikes, posts, setPosts)}
              />
              <div className="timestamp">{post.timestamp}</div>
            </div>
          </div>
        )) : <div className="post-item">NO DATA</div>}
      </div>
    </div>
  );
}

export default PostPage;

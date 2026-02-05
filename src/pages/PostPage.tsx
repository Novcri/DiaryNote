import { useState, useEffect, useCallback } from 'react';
import LikeButton from '../components/LikeButton';
import { type Post } from '../api';
import { fetchPosts } from '../utils/fetchPosts';
import { addPost } from '../utils/addPost';
import { handleUpdateLikes } from '../utils/handleUpdateLikes';
import Calendar from '../components/Calendar'; // Calendarコンポーネントをインポート
import '../style.css';

function PostPage() {
  const [newPost, setNewPost] = useState('');
  const [newGenre, setNewGenre] = useState('技術');
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // 選択された日付のステート

  // 投稿をフェッチする関数をuseCallbackでメモ化
  const getPosts = useCallback(async () => {
    await fetchPosts(setPosts, selectedDate, newGenre);
  }, [setPosts, selectedDate, newGenre]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  };

  const handleAddPost = async () => {
    await addPost(newPost, newGenre, setNewPost, setNewGenre, posts, setPosts);
    getPosts(); // 投稿追加後にリストを更新
  };

  return (
    <div className="container">
      <h1>One's Word's</h1>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}> {/* レイアウト調整 */}
        <div style={{ flex: 1, maxWidth: '550px' }}> {/* 投稿フォームとリスト */}
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
            <button onClick={handleAddPost}>Post</button>
          </div>
          <div className="post-list">
            {posts.length ? posts.map((post) => (
              <div key={post.id} className="post-item">
                <div className="post-text">{post.text}</div>
                <div className="post-footer">
                  <div className="like-button-wrapper">
                    <LikeButton
                      initialLikes={post.likes}
                      postId={post.id}
                      onUpdateLikes={(postId, newLikes) => handleUpdateLikes(postId, newLikes, posts, setPosts)}
                    />
                  </div>
                  <div className={`genre-tag ${post.genre === '技術' ? 'genre-tech' : post.genre === '日常' ? 'genre-daily' : 'genre-other'}`}>
                    {post.genre}
                  </div>
                  <div className="timestamp">{post.timestamp}</div>
                </div>
              </div>
            )) : <div className="post-item">NO DATA</div>}
          </div>
        </div>
        <Calendar onDateSelect={handleDateSelect} initialSelectedDate={selectedDate} /> {/* カレンダーコンポーネントを配置 */}
      </div>
    </div>
  );
}

export default PostPage;

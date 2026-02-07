import { useState, useEffect, useCallback } from 'react';
import LikeButton from '../components/LikeButton';
import { type Post } from '../api';
import { fetchPosts } from '../utils/fetchPosts';
import { handleUpdateLikes } from '../utils/handleUpdateLikes';
import Calendar from '../components/Calendar'; // Calendarコンポーネントをインポート
import '../style.css';

function ViewOnlyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null); // 'All'ではなくnullで初期化
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // 選択された日付のステート

  // 投稿をフェッチする関数をuseCallbackでメモ化
  const getPosts = useCallback(async () => {
    // selectedGenreがnullまたは'All'の場合は引数にnullを渡す
    const genreParam = selectedGenre === 'All' ? null : selectedGenre;
    await fetchPosts(setPosts, selectedDate, genreParam);
  }, [setPosts, selectedDate, selectedGenre]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === 'All' ? null : genre);
  };

  const genres = ['技術', '日常']; // 'All'はselectedGenreがnullの場合として扱う

  return (
    <div className="container">
      <h1>One's Word's (Read-Only)</h1>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}> {/* レイアウト調整 */}
        <div style={{ flex: 1, maxWidth: '550px' }}> {/* ジャンルフィルターとリスト */}
          <div className="genre-filter">
            <button
              onClick={() => handleGenreSelect('All')} // 'All'ボタンを追加
              className={selectedGenre === null ? 'active' : ''}
            >
              All
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={selectedGenre === genre ? 'active' : ''}
              >
                {genre}
              </button>
            ))}
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

export default ViewOnlyPage;

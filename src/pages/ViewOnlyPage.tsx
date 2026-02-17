import LikeButton from '../components/LikeButton';
import { handleUpdateLikes } from '../utils/handleUpdateLikes';
import Calendar from '../components/Calendar'; // Calendarコンポーネントをインポート
import '../style.css';
import { usePostFiltering } from '../hooks/usePostFiltering';
import { usePostFilter } from '../hooks/usePostFilter'; // usePostFilterをインポート

function ViewOnlyPage() {
  const { posts, setPosts, selectedGenre, handleGenreSelect, highlightedDates } = usePostFiltering(); // highlightedDates を取得
  const { selectedDate, handleDateSelect } = usePostFilter(); // selectedDateとhandleDateSelectを取得

  const genres = ['技術', '日常']; // 'All'はselectedGenreがnullの場合として扱う

  return (
    <div className="container">
      <h1>DiaryNote</h1>
      <div className="view-only-page-layout">
        <div className="post-column">
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
        <div className="calendar-column">
            <Calendar
              onDateSelect={handleDateSelect}
              initialSelectedDate={selectedDate}
              highlightedDates={highlightedDates} // highlightedDates を Calendar コンポーネントに渡す
            />
        </div>
      </div>
    </div>
  );
}

export default ViewOnlyPage;

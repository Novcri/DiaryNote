import { type Post } from '../api';
import { fetchPosts } from './fetchPosts';
import { addPost } from './addPost';

/**
 * 指定された日付とジャンルに基づいて投稿をフェッチし、ステートを更新します。
 * @param setPosts 投稿ステートのセッター関数
 * @param selectedDate 選択された日付 (ISO文字列またはnull)
 * @param selectedGenre 選択されたジャンル (文字列またはnull)
 */
export const fetchAndSetPosts = async (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  selectedDate: string | null,
  selectedGenre: string | null
) => {
  const genreParam = selectedGenre === 'All' ? null : selectedGenre;
  await fetchPosts(setPosts, selectedDate, genreParam);
};

/**
 * 新しい投稿を追加し、入力フィールドをクリアし、投稿リストを更新します。
 * @param newPost 新しい投稿の内容
 * @param newGenre 新しい投稿のジャンル
 * @param setNewPost 新しい投稿内容ステートのセッター関数
 * @param setNewGenre 新しい投稿ジャンルステートのセッター関数
 * @param refreshPosts 投稿リストを再フェッチするためのコールバック関数
 */
export const handlePostSubmission = async (
  newPost: string,
  newGenre: string,
  setNewPost: React.Dispatch<React.SetStateAction<string>>,
  setNewGenre: React.Dispatch<React.SetStateAction<string>>,
  refreshPosts: () => void
) => {
  await addPost(newPost, newGenre);
  setNewPost('');
  setNewGenre('技術'); // デフォルトジャンルに戻す
  refreshPosts(); // 投稿追加後にリストを更新
};

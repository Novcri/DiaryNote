import { createPost } from '../api';
import { getFormattedTimestamp } from './date';

export const addPost = async (
    newPost: string,
    newGenre: string,
) => {
    if (newPost.trim() === '') {
      return; // 空の投稿は処理しない
    }
    try {
        const response = await createPost({
            text: newPost,
            genre: newGenre,
            timestamp: getFormattedTimestamp(),
            likes: 0,
        });
        return response.data; // 新しく追加された投稿データを返す
    } catch (error) {
        console.error(error);
        throw error; // エラーを再スローして呼び出し元で処理できるようにする
    }
};

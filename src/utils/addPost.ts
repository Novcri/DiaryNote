import { createPost, type Post } from '../api';
import { getFormattedTimestamp } from './date';
import type { Dispatch, SetStateAction } from 'react';

export const addPost = async (
    newPost: string,
    newGenre: string,
    setNewPost: Dispatch<SetStateAction<string>>,
    setNewGenre: Dispatch<SetStateAction<string>>,
    posts: Post[],
    setPosts: Dispatch<SetStateAction<Post[]>>
) => {
    if (newPost.trim() !== '') {
        try {
            const response = await createPost({
                text: newPost,
                genre: newGenre,
                timestamp: getFormattedTimestamp(),
                likes: 0,
            });
            setPosts([response.data, ...posts]);
            setNewPost('');
            setNewGenre('');
        } catch (error) {
            console.error(error);
        }
    }
};

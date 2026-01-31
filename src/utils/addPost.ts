import { createPost, type Post } from '../api';
import { getFormattedTimestamp } from './date';
import type { Dispatch, SetStateAction } from 'react';

export const addPost = async (
    newPost: string,
    setNewPost: Dispatch<SetStateAction<string>>,
    posts: Post[],
    setPosts: Dispatch<SetStateAction<Post[]>>
) => {
    if (newPost.trim() !== '') {
        try {
            const response = await createPost({
                text: newPost,
                timestamp: getFormattedTimestamp(),
                likes: 0,
            });
            setPosts([response.data, ...posts]);
            setNewPost('');
        } catch (error) {
            console.error(error);
        }
    }
};

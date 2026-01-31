import { updateLikes, type Post } from '../api';
import type { Dispatch, SetStateAction } from 'react';

export const handleUpdateLikes = async (
    postId: number,
    newLikes: number,
    posts: Post[],
    setPosts: Dispatch<SetStateAction<Post[]>>
) => {
    try {
        await updateLikes(postId, newLikes);
        setPosts(posts.map(p => (p.id === postId ? { ...p, likes: newLikes } : p)));
    } catch (error) {
        console.error('Failed to update likes:', error);
        // Optionally revert the state change on failure
        setPosts(posts.map(p => p)); // This forces a re-render but doesn't change data
    }
};

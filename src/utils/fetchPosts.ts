import { getPosts, type Post } from '../api';
import type { Dispatch, SetStateAction } from 'react';

export const fetchPosts = async (setPosts: Dispatch<SetStateAction<Post[]>>, selectedDate: string | null, genre: string | null) => {
  try {
    const response = await getPosts(selectedDate, genre);
    setPosts(response.data);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error; // エラーを再スローする
  }
};

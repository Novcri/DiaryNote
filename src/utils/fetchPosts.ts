import { getPosts, type Post } from '../api';
import type { Dispatch, SetStateAction } from 'react';

export const fetchPosts = async (setPosts: Dispatch<SetStateAction<Post[]>>) => {
  try {
    const response = await getPosts();
    setPosts(response.data);
  } catch (error) {
    console.error(error);
  }
};

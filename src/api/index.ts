import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Post {
  id: number;
  text: string;
  genre: string;
  timestamp: string;
  likes: number;
}

export const getPosts = (selectedDate?: string | null, genre?: string | null) => {
  return apiClient.get<Post[]>('/posts', { params: { date: selectedDate, genre } });
};

export const createPost = (post: Omit<Post, 'id'>) => {
  return apiClient.post<Post>('/posts', post);
};

export const updateLikes = (id: number, likes: number) => {
  return apiClient.patch<Post>(`/posts/${id}`, { likes });
};
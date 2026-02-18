import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// トークンをヘッダーに設定するユーティリティ
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export interface User {
  email: string;
  name: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export const login = async (email: string, password: string) => {
  const response = await apiClient.post<LoginResponse>('/login', { email, password });
  return response.data;
};

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
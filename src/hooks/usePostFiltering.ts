import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { fetchAndSetPosts } from '../utils/postManagement';
import { type Post } from '../api';

export const usePostFiltering = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigateを初期化

  const refreshPosts = useCallback(async () => {
    try {
      await fetchAndSetPosts(setPosts, selectedDate, selectedGenre);
    } catch (error) {
      console.error("Failed to refresh posts, navigating to error page:", error);
      navigate('/error'); // エラーページにリダイレクト
    }
  }, [setPosts, selectedDate, selectedGenre, navigate]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === 'All' ? null : genre);
  };

  return {
    posts,
    setPosts, // handleUpdateLikesのために公開
    selectedDate,
    setSelectedDate,
    selectedGenre,
    setSelectedGenre,
    handleDateSelect,
    handleGenreSelect,
    refreshPosts,
  };
};

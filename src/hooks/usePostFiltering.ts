import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAndSetPosts } from '../utils/postManagement';
import { type Post } from '../api';
import { usePostFilter } from '../hooks/usePostFilter'; // Corrected import path

export const usePostFiltering = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { selectedDate, handleDateSelect } = usePostFilter();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const navigate = useNavigate();

  const refreshPosts = useCallback(async () => {
    try {
      await fetchAndSetPosts(setPosts, selectedDate, selectedGenre);
    } catch (error) {
      console.error("Failed to refresh posts, navigating to error page:", error);
      navigate('/error');
    }
  }, [setPosts, selectedDate, selectedGenre, navigate]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === 'All' ? null : genre);
  };

  return {
    posts,
    setPosts,
    selectedDate,
    selectedGenre,
    setSelectedGenre,
    handleDateSelect,
    handleGenreSelect,
    refreshPosts,
  };
};

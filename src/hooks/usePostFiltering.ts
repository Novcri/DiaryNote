import { useState, useEffect, useCallback } from 'react';
import { fetchAndSetPosts } from '../utils/postManagement'; // fetchAndSetPostsを再利用
import { type Post } from '../api'; // Post型をapiからインポート

export const usePostFiltering = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const refreshPosts = useCallback(async () => {
    await fetchAndSetPosts(setPosts, selectedDate, selectedGenre);
  }, [setPosts, selectedDate, selectedGenre]);

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

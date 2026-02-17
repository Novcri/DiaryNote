import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAndSetPosts } from '../utils/postManagement';
import { type Post, getPosts } from '../api'; // Import getPosts
import { usePostFilter } from '../hooks/usePostFilter'; // Corrected import path
import { formatDateToYYYYMMDD } from '../utils/date'; // Import formatDateToYYYYMMDD

export const usePostFiltering = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { selectedDate, handleDateSelect } = usePostFilter();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]); // New state for highlighted dates
  const navigate = useNavigate();

  const refreshPosts = useCallback(async () => {
    try {
      await fetchAndSetPosts(setPosts, selectedDate, selectedGenre);
    } catch (error) {
      console.error("Failed to refresh posts, navigating to error page:", error);
      navigate('/error');
    }
  }, [setPosts, selectedDate, selectedGenre, navigate]);

  const fetchAllPostDates = useCallback(async () => {
    try {
      const response = await getPosts(null, null); // Fetch all posts
      const dates = new Set<string>();
      response.data.forEach(post => {
        const dateStr = formatDateToYYYYMMDD(new Date(post.timestamp));
        dates.add(dateStr);
      });
      setHighlightedDates(Array.from(dates));
    } catch (error) {
      console.error("Failed to fetch all post dates:", error);
    }
  }, []);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  useEffect(() => {
    fetchAllPostDates(); // Fetch all post dates on mount
  }, [fetchAllPostDates]);

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
    highlightedDates, // Return highlighted dates
  };
};

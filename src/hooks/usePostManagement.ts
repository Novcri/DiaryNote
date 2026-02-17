import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handlePostSubmission } from '../utils/postManagement';
import { usePostFiltering } from './usePostFiltering';

export const usePostManagement = () => {
  const [newPost, setNewPost] = useState('');
  const [newGenre, setNewGenre] = useState('技術');
  const navigate = useNavigate();

  const {
    posts,
    setPosts,
    selectedDate,
    selectedGenre,
    setSelectedGenre,
    handleDateSelect,
    handleGenreSelect,
    refreshPosts,
    highlightedDates, // Add highlightedDates here
  } = usePostFiltering();

  const handleAddPost = async () => {
    try {
      await handlePostSubmission(newPost, newGenre, setNewPost, setNewGenre, refreshPosts);
    } catch (error) {
      console.error("Failed to add post, navigating to error page:", error);
      navigate('/error');
    }
  };

  return {
    newPost,
    setNewPost,
    newGenre,
    setNewGenre,
    posts,
    setPosts,
    selectedDate,
    selectedGenre,
    setSelectedGenre,
    handleDateSelect,
    handleGenreSelect,
    handleAddPost,
    refreshPosts,
    highlightedDates, // And return it here
  };
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { handlePostSubmission } from '../utils/postManagement';
import { usePostFiltering } from './usePostFiltering';

export const usePostManagement = () => {
  const [newPost, setNewPost] = useState('');
  const [newGenre, setNewGenre] = useState('技術');
  const navigate = useNavigate(); // useNavigateを初期化

  const {
    posts,
    setPosts,
    selectedDate,
    setSelectedDate,
    selectedGenre,
    setSelectedGenre,
    handleDateSelect,
    handleGenreSelect,
    refreshPosts,
  } = usePostFiltering();

  const handleAddPost = async () => {
    try {
      await handlePostSubmission(newPost, newGenre, setNewPost, setNewGenre, refreshPosts);
    } catch (error) {
      console.error("Failed to add post, navigating to error page:", error);
      navigate('/error'); // エラーページにリダイレクト
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
    setSelectedDate,
    selectedGenre,
    setSelectedGenre,
    handleDateSelect,
    handleGenreSelect,
    handleAddPost,
    refreshPosts,
  };
};

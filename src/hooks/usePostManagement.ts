import { useState } from 'react';
import { handlePostSubmission } from '../utils/postManagement'; // fetchAndSetPostsはusePostFiltering内で使用
import { usePostFiltering } from './usePostFiltering'; // usePostFilteringをインポート

export const usePostManagement = () => {
  const [newPost, setNewPost] = useState('');
  const [newGenre, setNewGenre] = useState('技術');

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
    await handlePostSubmission(newPost, newGenre, setNewPost, setNewGenre, refreshPosts);
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

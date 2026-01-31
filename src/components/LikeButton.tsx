import { useState, useEffect } from 'react';

interface LikeButtonProps {
  initialLikes: number;
  postId: number;
  onUpdateLikes: (postId: number, newLikes: number) => Promise<void>;
}

const LikeButton = ({ initialLikes, postId, onUpdateLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    if (likedPosts.includes(postId)) {
      setIsLiked(true);
    }
  }, [postId]);

  const toggleLike = async () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    try {
      await onUpdateLikes(postId, newLikes);
      setLikes(newLikes);
      setIsLiked(!isLiked);

      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (!isLiked) {
        // Like
        localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
      } else {
        // Unlike
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts.filter((id: number) => id !== postId)));
      }
    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };

  return (
    <div className="like-container">
      <button onClick={toggleLike}>{isLiked ? '❤️' : '🤍'}</button>
      <span>{likes}</span>
    </div>
  );
};

export default LikeButton;

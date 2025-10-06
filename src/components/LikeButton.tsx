import { useState } from 'react';

interface LikeButtonProps {
  initialLikes: number;
  postId: number;
  onUpdateLikes: (postId: number, newLikes: number) => Promise<void>;
}

const LikeButton = ({ initialLikes, postId, onUpdateLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = async () => {
    const newLikes = likes + (isLiked ? -1 : 1);
    try {
      await onUpdateLikes(postId, newLikes);
      setLikes(newLikes);
      setIsLiked(!isLiked);
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

import { useContext } from 'react';
import { PostFilterContext } from '../context/postFilterContextDefinition';

export const usePostFilter = () => {
  const context = useContext(PostFilterContext);
  if (context === undefined) {
    throw new Error('usePostFilter must be used within a PostFilterProvider');
  }
  return context;
};

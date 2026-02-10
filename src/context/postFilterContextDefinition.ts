import { createContext } from 'react';

interface PostFilterContextType {
  selectedDate: string | null;
  handleDateSelect: (date: string | null) => void;
}

export const PostFilterContext = createContext<PostFilterContextType | undefined>(undefined);

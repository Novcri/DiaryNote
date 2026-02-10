import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PostFilterContext } from './postFilterContextDefinition';

export const PostFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = useCallback((date: string | null) => {
    setSelectedDate(date);
  }, []);

  return (
    <PostFilterContext.Provider value={{ selectedDate, handleDateSelect }}>
      {children}
    </PostFilterContext.Provider>
  );
};

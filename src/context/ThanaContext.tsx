import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThanaContextType {
  selectedThana: string;
  setSelectedThana: (thana: string) => void;
}

const ThanaContext = createContext<ThanaContextType | undefined>(undefined);

export const ThanaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedThana, setSelectedThana] = useState<string>('all');

  return (
    <ThanaContext.Provider value={{ selectedThana, setSelectedThana }}>
      {children}
    </ThanaContext.Provider>
  );
};

export const useThana = () => {
  const context = useContext(ThanaContext);
  if (!context) {
    throw new Error('useThana must be used within a ThanaProvider');
  }
  return context;
};

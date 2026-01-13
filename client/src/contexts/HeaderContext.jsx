import React, { createContext, useState } from 'react';

export const HeaderContext = createContext(null);

export const HeaderProvider = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <HeaderContext.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </HeaderContext.Provider>
  );
};
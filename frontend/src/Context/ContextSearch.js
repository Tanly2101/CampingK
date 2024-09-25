import React, { createContext, useState } from "react";

export const ContextSearch = createContext({});

export const AppProvider = ({ children }) => {
  const [searchData, setSearchData] = useState("");

  return (
    <ContextSearch.Provider value={{ searchData, setSearchData }}>
      {children}
    </ContextSearch.Provider>
  );
};

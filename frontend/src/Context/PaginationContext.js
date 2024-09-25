import React, { createContext, useState, useContext } from "react";

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const setPage = (page) => {
    setCurrentPage(page);
  };

  const updateTotalItems = (total) => {
    setTotalItems(total);
  };

  const updatePageSize = (size) => {
    setPageSize(size);
  };

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        totalItems,
        pageSize,
        setPage,
        updateTotalItems,
        updatePageSize,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);

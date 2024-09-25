// ProductContext.js
import React, { createContext, useContext, useState } from "react";

const ProductsIdContext = createContext();

export const ProductIdProvider = ({ children }) => {
  const [currentProductId, setCurrentProductId] = useState(null);

  const setProductId = (productId) => {
    setCurrentProductId(productId);
  };
  return (
    <ProductsIdContext.Provider value={{ currentProductId, setProductId }}>
      {children}
    </ProductsIdContext.Provider>
  );
};

export const useProductsId = () => useContext(ProductsIdContext);

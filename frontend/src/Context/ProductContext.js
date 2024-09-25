import React, { createContext, useState, useContext } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const selectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <ProductContext.Provider value={{ selectedProduct, selectProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

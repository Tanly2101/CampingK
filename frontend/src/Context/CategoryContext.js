// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom"; // Import hook từ React Router

// // Tạo context
// const SubcategoryContext = createContext();

// // Tạo provider component
// export const SubcategoryProvider = ({ children }) => {
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//   const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

//   // Reset trạng thái khi đường dẫn thay đổi
//   useEffect(() => {
//     setSelectedSubcategory(null);
//   }, [location.pathname]);

//   return (
//     <SubcategoryContext.Provider
//       value={{ selectedSubcategory, setSelectedSubcategory }}
//     >
//       {children}
//     </SubcategoryContext.Provider>
//   );
// };

// // Hook để sử dụng context
// export const useSubcategory = () => useContext(SubcategoryContext);
import React, { createContext, useContext, useState } from "react";

// Tạo context
const SubcategoryContext = createContext();

// Tạo provider component
export const SubcategoryProvider = ({ children }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  return (
    <SubcategoryContext.Provider
      value={{ selectedSubcategory, setSelectedSubcategory }}
    >
      {children}
    </SubcategoryContext.Provider>
  );
};

// Hook để sử dụng context
export const useSubcategory = () => useContext(SubcategoryContext);
// Custom hook để sử dụng context

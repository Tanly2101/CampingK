import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Fetch danh sách sản phẩm đã xem từ API khi component được mount
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/product/ganday/recentlyViewed`
        );
        setRecentlyViewed(response.data); // Giả sử API trả về danh sách sản phẩm
      } catch (error) {
        console.error("Failed to fetch recently viewed products:", error);
      }
    };
    fetchRecentlyViewed();
  }, []);

  // Hàm thêm sản phẩm vào danh sách "Recently Viewed"
  const addProductToRecentlyViewed = async (productId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/product/recentlyViewedaxem`,
        { productId }
      );

      if (response.data) {
        // Sau khi thêm thành công, fetch lại danh sách
        const updatedList = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/product/ganday/recentlyViewed`
        );
        setRecentlyViewed(updatedList.data);
      }
    } catch (error) {
      console.error("Failed to add product to recently viewed:", error);
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addProductToRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

// Custom hook để dễ dàng sử dụng context
export const useRecentlyViewed = () => {
  return useContext(RecentlyViewedContext);
};

import React, { memo, useState, useEffect } from "react";
import { productInforTabs } from "../ultis/constant";
import axios from "axios";
const activeStyle = "";
const notActiveStyle = "";
const ProductInfor = ({ productId }) => {
  const [activedTab, setActivedTab] = useState(1);
  const [tabsData, setTabsData] = useState([]);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/product/${productId}`
        );
        const productData = response.data;

        // Cập nhật thông tin tab với dữ liệu từ backend
        const tabs = [
          {
            id: 1,
            name: "DESCRIPTION",
            content: productData.Description || "No description available.",
          },
          {
            id: 2,
            name: "THÔNG SỐ KỸ THUẬT",
            content: productData.chitiet || "No description available.",
          },
        ];

        setTabsData(tabs);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);
  return (
    <div>
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInforTabs.map((el) => (
          <span
            className={`py-2 px-4 cursor-pointer ${
              activedTab === el.id
                ? "bg-white border border-b-0"
                : "bg-gray-200"
            }`}
            key={el.id}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="border w-full p-4">
        {tabsData.some((el) => el.id === activedTab) && (
          <div
            dangerouslySetInnerHTML={{
              __html: tabsData.find((el) => el.id === activedTab)?.content,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ProductInfor);

import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryPhu = ({
  selectedCategoryId,
  onCategoryPhuChange,
  categoryPhu,
  categoryChinh,
}) => {
  const [datacate, setDatacate] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    categoryPhu || "Chọn một danh mục phụ"
  );
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (selectedCategoryId) {
      // Kiểm tra nếu categoryChinh khác với selectedCategoryId
      if (
        selectedSubcategory !== "Chọn một danh mục phụ" &&
        categoryChinh !== selectedCategoryId
      ) {
        setWarningMessage("Danh mục chính đã thay đổi.");
      } else {
        setWarningMessage(""); // Xóa cảnh báo nếu không vi phạm điều kiện
      }

      setSelectedSubcategory("Chọn một danh mục phụ");

      // Lấy danh sách danh mục phụ từ API
      axios
        .get(
          `http://localhost:5000/api/v1/categorySubList/${selectedCategoryId}`
        )
        .then((response) => {
          setDatacate(response.data);

          // Kiểm tra nếu `categoryPhu` có trong danh sách
          if (categoryPhu) {
            const foundSubcategory = response.data.find(
              (item) => item.title === categoryPhu
            );
            if (foundSubcategory) {
              setSelectedSubcategory(categoryPhu); // Đặt `selectedSubcategory` bằng `categoryPhu`
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
          setDatacate([]);
        });
    } else {
      setDatacate([]);
    }
  }, [selectedCategoryId, categoryPhu, categoryChinh]); // Thêm `categoryChinh` vào dependency array

  useEffect(() => {
    // Gửi thông báo về thay đổi danh mục phụ cho component cha
    const notifyCategoryChange = () => {
      if (selectedSubcategory === "Chọn một danh mục phụ") {
        onCategoryPhuChange(""); // Gửi giá trị rỗng
      } else {
        onCategoryPhuChange(selectedSubcategory); // Gửi danh mục phụ đã chọn
      }
    };

    notifyCategoryChange();
  }, [selectedSubcategory]);

  const handleSelectCategoryPhu = (id, title) => {
    setSelectedSubcategory(title); // Cập nhật tên danh mục phụ đã chọn
    setShowDropdown(false); // Đóng dropdown sau khi chọn
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Danh Sách Danh Mục Phụ</h2>
      {warningMessage && (
        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
          {warningMessage}
        </div>
      )}
      {datacate.length > 0 ? (
        <div className="relative">
          <div className="border rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedSubcategory}
            </button>
            {showDropdown && (
              <ul className="absolute left-0 z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {datacate.map((item) => (
                  <li
                    key={item.idloaisanpham}
                    className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                    onClick={() =>
                      handleSelectCategoryPhu(item.idloaisanpham, item.title)
                    }
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Không có danh mục nào để hiển thị.</p>
      )}
    </div>
  );
};

export default CategoryPhu;

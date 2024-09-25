import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryPhu = ({ selectedCategoryId, onCategoryPhuChange }) => {
  const [datacate, setDatacate] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    "Chọn một danh mục phụ"
  );
  const [warningMessage, setWarningMessage] = useState("");
  useEffect(() => {
    // Fetch all subcategories
    axios
      .get(`http://localhost:5000/api/v1/categorySubList`)
      .then((response) => {
        setDatacate(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
        setDatacate([]);
      });
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      if (selectedSubcategory !== "Chọn một danh mục phụ") {
        setWarningMessage(
          "Danh mục chính đã thay đổi. Dữ liệu phụ đã bị xóa vì không nằm trong phạm trù đó."
        );
        setTimeout(() => {
          setWarningMessage(""); // Clear the warning after a few seconds
        }, 3000); // Adjust the timeout duration as needed
      }

      setSelectedSubcategory("Chọn một danh mục phụ");

      axios
        .get(
          `http://localhost:5000/api/v1/categorySubList/${selectedCategoryId}`
        )
        .then((response) => {
          setDatacate(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
          setDatacate([]);
        });
    } else {
      setDatacate([]);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    // Notify the parent if selectedSubcategory changes
    const notifyCategoryChange = () => {
      if (selectedSubcategory === "Chọn một danh mục phụ") {
        onCategoryPhuChange(""); // Send empty string
      } else {
        onCategoryPhuChange(selectedSubcategory); // Send the selected subcategory
      }
    };

    notifyCategoryChange();
  }, [selectedSubcategory]);

  const handleSelectCategoryPhu = (id, title) => {
    setSelectedSubcategory(title); // Update the selected subcategory name
    setShowDropdown(false); // Close dropdown after selection
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
                    key={item.id}
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

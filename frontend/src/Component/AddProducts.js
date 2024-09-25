import React, { useState } from "react";
import axios from "axios";
import CategoryPhu from "./CategoryPhu";
const AddProductModal = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState(""); // Mô tả sản phẩm
  const [thuonghieu, setThuonghieu] = useState(""); // Thương hiệu
  const [idCategory, setIdCategory] = useState(""); // Danh mục
  const [productSold, setProductSold] = useState(0); // Số lượng sản phẩm
  const [productImage, setProductImage] = useState([]); // Ảnh sản phẩm
  const [nameCategoryPhu, setNameCategoryPhu] = useState("");
  const [gianhap, setGianhap] = useState(""); // Giá nhập
  const [chitiet, setChitiet] = useState(""); // Chi tiết sản phẩm
  // Dummy data for dropdowns (replace with your data source)
  const thuonghieuOptions = [
    { value: 1, label: "Thule" },
    { value: 2, label: "Salomon" },
    { value: 3, label: "Patagonia" },
    { value: 4, label: "The North Face" },
    { value: 5, label: "Arc'teryx" },
    { value: 6, label: "HOKA" },
    { value: 7, label: "Vuori" },
    { value: 8, label: "Thousand" },
    { value: 9, label: "Yakima" },
    { value: 10, label: "Smartwool" },
  ];

  const idCategoryOptions = [
    { value: 1, label: "Cắm trại " },
    { value: 2, label: "Leo Núi" },
    { value: 3, label: "Xe Đạp" },
    { value: 4, label: "Fitness" },
    { value: 5, label: "Bơi Lội" },
    { value: 6, label: "Chạy" },
    { value: 7, label: "Du Lịch" },
  ];

  const handleImageChange = (e) => {
    setProductImage(Array.from(e.target.files)); // Convert FileList to Array
  };

  const handleCategoryChange = (e) => {
    setIdCategory(e.target.value);
    // Reset additional category data when changing category
    setNameCategoryPhu("");
  };
  const handleCategoryPhuChange = (title) => {
    setNameCategoryPhu(title); // Cập nhật title danh mục phụ khi có sự thay đổi
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Title", productName);
    formData.append("Price", productPrice);
    formData.append("Description", productDescription);
    formData.append("thuonghieu", thuonghieu);
    formData.append("idCategory", idCategory);
    formData.append("nameCategoryPhu", nameCategoryPhu);
    formData.append("sold", productSold);
    formData.append("gianhap", gianhap); // Thêm giá nhập
    formData.append("chitiet", chitiet); // Thêm chi tiết sản phẩm
    formData.append("loaisanpham", "new");

    // Append each image to FormData
    productImage.forEach((image) => {
      formData.append(`Images[]`, image);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/product/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Product added successfully!");
        onClose();
      } else {
        alert("Failed to add product!");
      }
    } catch (error) {
      console.error("There was an error!", error);
      alert("Error adding product!");
    }
  };
  return (
    <div className="fixed inset-0 flex w-full items-center justify-center z-[1001] bg-black bg-opacity-50 p-10">
      <div className="bg-white p-10 w-full rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product Price</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-md"
              multiple
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Number Sold</label>
            <input
              type="number"
              value={productSold}
              onChange={(e) => setProductSold(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Brand</label>
            <select
              value={thuonghieu}
              onChange={(e) => setThuonghieu(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Chọn Thương Hiệu</option>
              {thuonghieuOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              value={idCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Chọn Loại Sản Phẩm</option>
              {idCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {idCategory && (
            <CategoryPhu
              selectedCategoryId={idCategory}
              onCategoryPhuChange={handleCategoryPhuChange}
            />
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Nhập Giá</label>
            <input
              type="number"
              value={gianhap}
              onChange={(e) => setGianhap(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Chi Tiết Sản Phẩm</label>
            <textarea
              value={chitiet}
              onChange={(e) => setChitiet(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              // onClick={onClose}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose} // Đóng modal khi nhấn Cancel
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

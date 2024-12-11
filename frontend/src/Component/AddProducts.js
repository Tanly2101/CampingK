import React, { useState } from "react";
import axios from "axios";
import CategoryPhu from "./CategoryPhu";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
const AddProductModal = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState(""); // Mô tả sản phẩm
  const [thuonghieu, setThuonghieu] = useState(""); // Thương hiệu
  const [idCategory, setIdCategory] = useState(""); // Danh mục
  const [productSold, setProductSold] = useState(null); // Số lượng sản phẩm
  const [productImage, setProductImage] = useState([]); // Ảnh sản phẩm
  const [nameCategoryPhu, setNameCategoryPhu] = useState("");
  const [gianhap, setGianhap] = useState(""); // Giá nhập
  const [preview, setPreview] = useState([]);
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
    { value: 11, label: "Thương Hiệu Khác" },
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
  ///////////////////thêm ảnh
  // const handleImageChange = (e) => {
  //   setProductImage(Array.from(e.target.files)); // Convert FileList to Array
  // };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImage((prevImages) => [...prevImages, ...files]);

    // Create previews for each image
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreview((prevPreviews) => [...prevPreviews, ...imagePreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = productImage.filter((_, i) => i !== index);
    const updatedPreviews = preview.filter((_, i) => i !== index);
    setProductImage(updatedImages);
    setPreview(updatedPreviews);
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

    if (productImage.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Chưa có ảnh đại diện",
        timer: 2000,
      });
      return;
    }
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
        // alert("Product added successfully!");
        Swal.fire({
          title: "Product added successfully!",
          width: 600,
          padding: "3em",
          color: "#716add",
          timer: 2000, // Thời gian tự động đóng
          background: "#fff url(/images/trees.png)",
          backdrop: `
            rgba(0,0,123,0.4)
            left top
            no-repeat
          `,
        });
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
            <label className="block text-gray-700">Tên sản phẩm</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Giá sản phẩm</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Thông tin</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-md"
              multiple
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700">Hình ảnh đại diện</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-md"
              multiple
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image Preview</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {preview.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={image}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng</label>
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
            <label className="block text-gray-700">Thương hiệu</label>
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
            <label className="block text-gray-700">Loại sản phẩm</label>
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
            <label className="block text-gray-700">Nhập giá nhập hàng</label>
            <input
              type="number"
              value={gianhap}
              onChange={(e) => setGianhap(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">Chi Tiết Sản Phẩm</label>
            <textarea
              value={chitiet}
              onChange={(e) => setChitiet(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div> */}
          <div>
            <label
              htmlFor="chitiet"
              className="block text-sm font-medium text-gray-700"
            >
              Chi Tiết Sản Phẩm
            </label>
            <Editor
              apiKey="hanuvt9goeoa4t35vf4y63bpjjadg7msb59meo5rw1vrnt8x" // Thay bằng API key của bạn
              value={chitiet}
              onEditorChange={(newContent) => setChitiet(newContent)} // Cập nhật giá trị `chitiet`
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "link",
                  "lists",
                  "charmap",
                  "preview",
                  "anchor",
                  "pagebreak",
                  "searchreplace",
                  "wordcount",
                  "visualblocks",
                  "visualchars",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "emoticons",
                  "help",
                ],
                toolbar:
                  "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | link | print preview fullscreen | " +
                  "forecolor backcolor emoticons | help",
                image_advtab: false, // Tắt tab chỉnh sửa ảnh
                automatic_uploads: false, // Tắt tải ảnh tự động
              }}
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

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useProductsId } from "../Context/ProductsIdContext";
import CategoryPhu from "./CategoryPhu";
import Swal from "sweetalert2";
const EditProducts = ({ onClose }) => {
  const { currentProductId } = useProductsId();
  const [currentData, setCurrentData] = useState(null); // Dữ liệu hiện tại
  const [editedData, setEditedData] = useState(null); // Dữ liệu đang chỉnh sửa
  const [productImage, setProductImage] = useState(null);
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
    { value: 1, label: "Cắm trại" },
    { value: 2, label: "Leo Núi" },
    { value: 3, label: "Xe Đạp" },
    { value: 4, label: "Fitness" },
    { value: 5, label: "Bơi Lội" },
    { value: 6, label: "Chạy" },
    { value: 7, label: "Du Lịch" },
  ];
  // Load product data when component mounts or productId changes
  useEffect(() => {
    if (!currentProductId) return;

    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/product/${currentProductId}`
        );
        setCurrentData(response.data);
        setEditedData(response.data); // Khởi tạo editedData với dữ liệu hiện tại
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [currentProductId]);

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };
  // console.log(currentData);
  const parseCurrency = (value) => {
    return value.replace(/\./g, ""); // Remove dots to parse number
  };
  // console.log(currentData);
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // If the input is for Price or gianhap, parse the currency before updating state
  //   if (name === "Price" || name === "gianhap" || name === "PriceSale") {
  //     const parsedValue = parseCurrency(value); // Remove dots from the input
  //     setEditedData({ ...editedData, [name]: parsedValue });
  //   } else {
  //     setEditedData({ ...editedData, [name]: value });
  //   }
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra nếu là trường 'idCategory' (danh mục chính)
    if (name === "idCategory") {
      setEditedData({
        ...editedData,
        idCategory: value, // Cập nhật danh mục chính
        nameCategoryPhu: "", // Reset danh mục phụ
      });
    }
    // Xử lý các trường Price, gianhap, và PriceSale để parse currency
    else if (name === "Price" || name === "gianhap" || name === "PriceSale") {
      const parsedValue = parseCurrency(value); // Loại bỏ các dấu chấm trong input
      setEditedData({ ...editedData, [name]: parsedValue });
    }
    // Xử lý các trường khác bình thường
    else {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImage(files); // Lưu tất cả các tệp ảnh vào state
  };

  // const handleSave = async () => {
  //   const formData = new FormData();
  //   // Append all edited data to formData
  //   for (const [key, value] of Object.entries(editedData)) {
  //     formData.append(key, value);
  //   }

  //   // Append image if available
  //   if (Array.isArray(productImage)) {
  //     productImage.forEach((imageFile) => {
  //       formData.append("updateImages", imageFile);
  //     });
  //   } else {
  //     console.warn("productImage không phải là một mảng hoặc là null");
  //   }

  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_SERVER_URL}/api/v1/product/update/${currentProductId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     alert("Product updated successfully!");
  //     onClose(); // Close the modal on success
  //   } catch (error) {
  //     console.error("Error updating product data:", error);
  //   }
  // };
  // const handleSave = async () => {
  //   // Kiểm tra nếu có sự thay đổi ở bất kỳ trường nào trong currentData
  //   console.log(editedData);
  //   if (!currentData || !editedData) {
  //     alert("Dữ liệu chưa sẵn sàng, vui lòng thử lại sau.");
  //     return;
  //   }
  //   const hasChanges = Object.keys(currentData).some(
  //     (key) => currentData[key] !== editedData[key]
  //   );

  //   // Nếu có thay đổi và idCategory khác, cần đặt lại nameCategoryPhu
  //   if (hasChanges && editedData.idCategory !== currentData.idCategory) {
  //     if (!editedData.nameCategoryPhu) {
  //       alert(
  //         "Bạn cần nhập giá trị cho nameCategoryPhu khi đổi có 1 dữ kiện thay đổi chính!"
  //       );
  //       return;
  //     }
  //   }

  //   const formData = new FormData();

  //   // Append tất cả dữ liệu đã chỉnh sửa vào formData
  //   for (const [key, value] of Object.entries(editedData)) {
  //     formData.append(key, value);
  //   }

  //   // Append hình ảnh nếu có
  //   if (Array.isArray(productImage)) {
  //     productImage.forEach((imageFile) => {
  //       formData.append("updateImages", imageFile);
  //     });
  //   } else {
  //     console.warn("productImage không phải là một mảng hoặc là null");
  //   }

  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_SERVER_URL}/api/v1/product/update/${currentProductId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     alert("Product updated successfully!");
  //     onClose(); // Đóng modal nếu cập nhật thành công
  //   } catch (error) {
  //     console.error("Error updating product data:", error);
  //   }
  // };
  // console.log(currentData.nameCategoryPhu);
  const handleSave = async () => {
    // Kiểm tra nếu đổi category chính mà nameCategoryPhu bị bỏ trống

    const isDataChanged =
      editedData.Title !== currentData.Title ||
      editedData.Description !== currentData.Description ||
      editedData.Price !== currentData.Price ||
      editedData.PriceSale !== currentData.PriceSale ||
      editedData.loaisanpham !== currentData.loaisanpham ||
      editedData.sold !== currentData.sold ||
      editedData.thuonghieu !== currentData.thuonghieu ||
      editedData.idCategory !== currentData.idCategory ||
      editedData.gianhap !== currentData.gianhap ||
      editedData.chitiet !== currentData.chitiet;

    if (isDataChanged && !editedData.nameCategoryPhu) {
      alert("Bạn cần nhập giá trị cho Danh Mục Phụ vì nó đang thiếu dữ liệu");
      return;
    }

    const formData = new FormData();

    // Append tất cả dữ liệu đã chỉnh sửa vào formData
    for (const [key, value] of Object.entries(editedData)) {
      formData.append(key, value);
    }

    // Append hình ảnh nếu có
    if (Array.isArray(productImage)) {
      productImage.forEach((imageFile) => {
        formData.append("updateImages", imageFile);
      });
    } else {
      console.warn("productImage không phải là một mảng hoặc là null");
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/product/update/${currentProductId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // alert("Product updated successfully!");
      Swal.fire({
        title: "Product updated successfully!",
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
      onClose(); // Đóng modal nếu cập nhật thành công
    } catch (error) {
      console.error("Error updating product data:", error);
    }
  };

  const handleCategoryPhuChange = (selectedCategoryPhuName) => {
    setEditedData({ ...editedData, nameCategoryPhu: selectedCategoryPhuName });
  };

  if (!currentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg p-10 flex flex-col w-3/4 max-w-5xl z-10">
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="flex">
            <table className="w-1/2 table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Current Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">
                    Tên sản phẩm: {currentData.Title}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Giá: {formatCurrency(currentData.Price)}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Giá Nhập Vào : {formatCurrency(currentData.gianhap)}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Số Lượng: {currentData.sold}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    Thông tin: {currentData.Description}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Thương hiệu:{" "}
                    {
                      thuonghieuOptions.find(
                        (option) => option.value === currentData.thuonghieu
                      )?.label
                    }
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Thể loại:{" "}
                    {
                      idCategoryOptions.find(
                        (option) => option.value === currentData.idCategory
                      )?.label
                    }
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Loại Sản Phẩm:
                    {currentData.loaisanpham}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Loại Sản Phẩm Phụ:
                    {currentData.nameCategoryPhu}
                  </td>
                </tr>
                {/* <tr>
                  <td className="border px-4 py-2">
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}/src/uploads/avatarProducts/${currentData.HinhAnh}`}
                      alt="Current"
                      className="w-24 h-24 object-cover"
                    />
                  </td>
                </tr> */}
              </tbody>
            </table>

            <div className="flex flex-col justify-center mx-8 text-3xl font-bold">
              <div>→</div>
              <div>→</div>
              <div>→</div>
              <div>→</div>
            </div>

            <table className="w-1/2 table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Edit Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="Title"
                      value={editedData.Title}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Enter new name"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type=""
                      name="Price"
                      value={formatCurrency(editedData.Price)}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Enter new price"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="gianhap"
                      value={formatCurrency(editedData.gianhap)}
                      onChange={handleInputChange}
                      onBlur={(e) => {
                        if (e.target.value.trim() === "") {
                          handleInputChange({
                            target: { name: "gianhap", value: 0 },
                          });
                        }
                      }}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Enter new Giá Nhập"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      name="sold"
                      value={editedData.sold}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Enter new quantity"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="Description"
                      value={editedData.Description}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Enter new description"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="loaisanpham"
                      value={editedData.loaisanpham}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Enter new loaisanpham"
                    />
                  </td>
                </tr>
                {editedData.loaisanpham === "Sale" && (
                  <tr>
                    <td className="border px-4 py-2">
                      <input
                        type=""
                        name="PriceSale"
                        // value={formatCurrency(editedData.PriceSale)}
                        value={formatCurrency(
                          Number(editedData?.PriceSale) || 0
                        )}
                        onChange={handleInputChange}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Enter sale price"
                      />
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="border px-4 py-2">
                    <select
                      name="thuonghieu"
                      value={editedData.thuonghieu}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    >
                      {thuonghieuOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <select
                      name="idCategory"
                      value={editedData.idCategory}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    >
                      {idCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {editedData.idCategory && (
                  <CategoryPhu
                    selectedCategoryId={editedData.idCategory}
                    categoryChinh={currentData.idCategory}
                    categoryPhu={currentData.nameCategoryPhu} // Pass the selected category ID
                    onCategoryPhuChange={handleCategoryPhuChange} // Handle subcategory change
                  />
                )}
                <tr>
                  <td className="border px-4 py-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                    {productImage && (
                      <div className="mt-2">
                        {productImage.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Selected ${index}`}
                            className="w-24 h-24 object-cover mr-2"
                          />
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Save and Close Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;

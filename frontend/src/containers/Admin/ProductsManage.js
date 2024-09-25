import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";
import AddProducts from "../../Component/AddProducts";
import EditProducts from "../../Component/EditProducts";
import { useProductsId } from "../../Context/ProductsIdContext";
const ProductsManage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Khai báo biến totalPages
  const [selectedProductId, setSelectedProductId] = useState(null); //delete
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showEditProductForm, setShowEditProductForm] = useState(false);
  const { currentProductId, setProductId } = useProductsId();
  useEffect(() => {
    console.log(products);
    getProducts();
  }, [currentPage]);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/product`
      );
      const allProducts = response.data;
      const startIndex = (currentPage - 1) * 15;
      const endIndex = startIndex + 15;
      const productsOnCurrentPage = allProducts.slice(startIndex, endIndex);
      setProducts(productsOnCurrentPage);
      const totalProducts = allProducts.length;
      const totalPages = Math.ceil(totalProducts / 15);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDelete = (id) => {
    setSelectedProductId(id); // Save the id to the state
    deleteProducts(id); // Call the delete function with the id
  };

  const deleteProducts = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/product/${id}`
      );
      // console.log("Product deleted:", response.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
        width: "40em",
      });
      // Add logic to remove the product from the UI or refresh the product list
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };
  const handleAddProductClick = () => {
    setShowAddProductForm(!showAddProductForm); // Toggle trạng thái hiển thị form
  };

  const handleCloseForm = () => {
    setShowAddProductForm(false);
    setShowEditProductForm(false); // Đóng form khi hủy
  };

  const handleEditProductClick = (productId) => {
    setProductId(productId);
    setShowEditProductForm(!showEditProductForm);
    // Toggle form visibility
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold  text-gray-900">Manage Products</h1>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddProductClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add New Product
            </button>
          </div>
          {showAddProductForm && <AddProducts onClose={handleCloseForm} />}
        </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình Ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Avatar
                      src={`${process.env.REACT_APP_SERVER_URL}/src/uploads/avatarProducts/${product.HinhAnh}`}
                      alt={product}
                      size="lg"
                      className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {showEditProductForm && currentProductId === product.id && (
                      <EditProducts
                        productId={currentProductId}
                        onClose={handleCloseForm}
                      />
                    )}
                    <button
                      onClick={() => handleEditProductClick(product.id)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>

                    {/* Conditionally render the EditProducts component */}

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Button
              variant="outlined"
              size="sm"
              style={{ padding: "3px" }}
              onClick={handlePreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
                />
              </svg>
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <IconButton
                  key={index}
                  variant={currentPage === index + 1 ? "outlined" : "text"}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </IconButton>
              ))}
            </div>
            <Button
              variant="outlined"
              size="sm"
              style={{ padding: "3px" }}
              onClick={handleNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16.175 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.175l-4.9-4.9q-.3-.3-.288-.7t.313-.7q.3-.275.7-.288t.7.288l6.6 6.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-6.6 6.6q-.275.275-.687.275T11.3 19.3q-.3-.3-.3-.712t.3-.713z"
                />
              </svg>
            </Button>
          </CardFooter>
        </div>
      </div>
    </div>
  );
};

export default ProductsManage;

import React, { useEffect, useState } from "react";
import axios from "axios";
const UserManage = () => {
  const [account, setAccount] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("user");
  const itemsPerPage = 5; // Số items hiển thị mỗi trang

  useEffect(() => {
    getAccount();
  }, []); // Chỉ chạy một lần khi component mount

  // useEffect để kiểm tra khi account thay đổi
  useEffect(() => {
    console.log("Updated account:", account);
  }, [account]);

  const getAccount = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/user/`);
      console.log("API Response:", response.data);
      response.data.forEach((item) => {
        console.log("Item:", item); // Kiểm tra từng item để xem có thuộc tính vaitro không
      });
      setAccount(response.data); // Cập nhật state account với dữ liệu lấy từ API
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lọc account dựa trên vaitro (1 là admin, 2 là user)
  const adminData = account.filter((item) => item.vaitro === "1");
  const userData = account.filter((item) => item.vaitro === "2");

  // Lấy dữ liệu hiện tại dựa trên tab đang chọn
  const currentData =
    activeTab === "user"
      ? userData.slice(indexOfFirstItem, indexOfLastItem)
      : adminData.slice(indexOfFirstItem, indexOfLastItem);

  console.log("Current Data:", currentData);
  console.log("Admin Data:", adminData);
  console.log("User Data:", userData);
  console.log("Current Data:", currentData);
  // Tính tổng số item và tổng số trang dựa trên tab
  const totalItems = activeTab === "user" ? userData.length : adminData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset trang khi đổi tab
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleRoleChange = async (userId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/user/updateRole/${userId}`
      );

      // Hiển thị thông báo thành công
      alert(response.data.message || "Role updated successfully!");

      // Làm mới trang
      window.location.reload();
    } catch (error) {
      console.error("Error updating role:", error);

      // Hiển thị thông báo lỗi
      alert("Error updating role. Please try again.");
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`mr-4 pb-2 ${
            activeTab === "user" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleTabClick("user")}
        >
          User Accounts
        </button>
        <button
          className={`mr-4 pb-2 ${
            activeTab === "admin" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleTabClick("admin")}
        >
          Admin Accounts
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">{item.nameTK}</td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className={`py-1 px-3 rounded ${
                        item.vaitro === "1"
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                      onClick={() => handleRoleChange(item.id)}
                    >
                      {item.vaitro === "1" ? "Revoke Admin" : "Grant Admin"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <button
          className={`px-2 py-1 mx-1 ${
            currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-2 py-1 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`px-2 py-1 mx-1 ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-300"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManage;

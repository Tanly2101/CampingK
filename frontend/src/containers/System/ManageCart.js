import React, { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Import Heroicons for checkmark and X icons
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
const ManageCart = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);

  const { user } = useAuth();

  const tabs = [
    { id: "Đang Xử Lí", label: "Chờ xác nhận" },
    { id: "Đã Duyệt", label: "Chờ giao hàng" },
    { id: "Chờ Lấy Hàng", label: "Chờ Lấy Hàng" },
    { id: "Đã hủy", label: "Đã hủy" },
    { id: "Đã Giao", label: "Giao hàng thành công" },
    { id: "Lịch sử", label: "Lịch sử đơn hàng" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const userOrders = data.filter((order) => order.customer_id === user.id);

  const filteredOrders =
    activeTab === "Lịch sử"
      ? userOrders.filter((order) => order.trangthai === "Đã Giao") // Hiển thị đơn hàng thành công khi `activeTab` là "History"
      : userOrders.filter((order) => order.trangthai === activeTab); // Lọc đơn hàng dựa trên `trangthai` tương ứng với `activeTab`
  useEffect(() => {
    if (!user?.id) {
      console.error("User ID is not available");
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/order/findall/${user.id}`
      )
      .then((response) => {
        console.log(response.data); // Log the response data
        setData(response.data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let productsResponse;

        if (selectedOrder) {
          // Use the selectedOrder value in the API request
          productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/order/productdt/${selectedOrder}`
          );

          // Update dataDetail with the fetched data
          setDataDetail(productsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedOrder]);
  useEffect(() => {
    const handleCancelOrder = async () => {
      try {
        if (selectedCancelOrder) {
          // Gọi API để xóa đơn hàng
          const cancelResponse = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/order/cancelOrder/${selectedCancelOrder}`
          );

          if (cancelResponse.status === 200) {
            console.log("Order canceled successfully:", cancelResponse.data);
            alert("Order canceled successfully!");

            // Reload lại trang
            window.location.reload();
          }
        }
      } catch (error) {
        console.error(
          "Error canceling order and fetching products data:",
          error
        );
      }
    };

    handleCancelOrder();
  }, [selectedCancelOrder]);

  useEffect(() => {
    console.log(dataDetail);
  }, [dataDetail]);
  const handleViewDetails = async (order) => {
    setSelectedOrder(order.order_id);
    console.log("Selected Order ID:", order.order_id);
    setIsOverlayVisible(true);
    // Additional logic to show the details overlay or perform other actions
  };
  const handleCancelOrder = (order) => {
    setSelectedCancelOrder(order.order_id);
    console.log("cancel ID:", order.order_id);
    // Additional logic to show the details overlay or perform other actions
  };
  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
    setSelectedOrder(null);
  };
  const adressOrders = dataDetail.find(
    (find) => find.order_id === selectedOrder
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <div className="mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 mr-2 rounded-t-lg ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-gray-600">
                Tên người dùng
              </th>
              <th className="py-2 px-4 text-left text-gray-600">Địa chỉ</th>
              <th className="py-2 px-4 text-left text-gray-600">Trạng thái</th>
              <th className="py-2 px-4 text-left text-gray-600">Hành động</th>
              <th className="py-2 px-4 text-left text-gray-600">
                Thời Gian Đặt Hàng
              </th>
              <th className="py-2 px-4 text-left text-gray-600">
                Thời Gian Giao Hàng
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2 px-4">{order.nameTK}</td>
                <td className="py-2 px-4">{`${order.shipping_address.slice(
                  0,
                  20
                )}...`}</td>
                <td className="py-2 px-4">
                  {order.trangthai === "Đã Giao" ? (
                    <CheckIcon className="w-6 h-6 text-green-500" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-red-500" />
                  )}
                </td>
                <td className="py-2 px-4">
                  {order.order_date
                    ? new Date(order.order_date).toLocaleDateString()
                    : "...."}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    onClick={() => handleViewDetails(order)}
                  >
                    Xem chi tiết
                  </button>
                  {order.trangthai === "Đang Xử Lí" && (
                    <>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600">
                        Chỉnh sửa
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  {order.trangthai === "Đã hủy" && (
                    <>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600">
                        Mua Lại
                      </button>
                    </>
                  )}
                </td>
                <td className="py-2 px-4">
                  {order.updated_at ? order.updated_at : "...."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Full-Screen Overlay */}
      {isOverlayVisible && dataDetail && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p className="mb-2">
              <strong>User Name:</strong> {user.nameTK}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {adressOrders?.shipping_address}
            </p>
            <p className="mb-2">
              <strong>Products:</strong>
            </p>
            <ul className="list-disc pl-5 mb-4">
              {dataDetail?.map((product, index) => (
                <li key={index}>
                  <div>
                    <img
                      src={`/img/${product.Images}`}
                      alt={product.title}
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div>Tên sản phẩm: {product.title}</div>
                  <div>Giá: {product.Price}</div>
                  <div>Số lượng: {product.quantity}</div>
                </li>
              ))}
            </ul>
            <p className="mb-2 flex">
              <strong>Approved:</strong>{" "}
              {userOrders?.trangthai === "Đã Giao" ? (
                <CheckIcon className="w-6 h-6 text-green-500" />
              ) : (
                <XMarkIcon className="w-6 h-6 text-red-500" />
              )}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleCloseOverlay}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCart;

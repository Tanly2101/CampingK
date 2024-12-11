import React, { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Import Heroicons for checkmark and X icons
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";
const ManageCart = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);

  const { user } = useAuth();

  const tabs = [
    { id: "Đang Xử Lí", label: "Chờ xác nhận" },
    { id: "Đã Duyệt", label: "Đã Duyệt" },
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
      : activeTab === "Đang Xử Lí"
      ? userOrders.filter(
          (order) =>
            order.trangthai === "Đang Xử Lí" ||
            order.trangthai === "Đã thanh toán"
        )
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
        console.log(response.data);
        setData(response.data); // Cập nhật trạng thái với dữ liệu được tìm nạp
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
          // Sử dụng giá trị selectedOrder trong yêu cầu API
          productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/order/productdt/${selectedOrder}`
          );
          console.log(dataDetail);
          // Cập nhật dataDetail với dữ liệu được tìm nạp
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
            // console.log("Order canceled successfully:", cancelResponse.data);
            // alert("Order canceled successfully!");

            // // Reload lại trang
            // window.location.reload();
            Swal.fire({
              icon: "success", // Biểu tượng thành công
              title: "Order Canceled Successfully!", // Tiêu đề thông báo
              text: "", // Nội dung bổ sung (bỏ trống nếu không cần)
              confirmButtonText: "OK", // Nội dung nút xác nhận
            }).then(() => {
              // Reload lại trang sau khi người dùng nhấn nút OK
              window.location.reload();
            });
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
    // Logic bổ sung để hiển thị lớp phủ chi tiết hoặc thực hiện các hành động khác
  };
  const handleCancelOrder = (order) => {
    setSelectedCancelOrder(order.order_id);
    console.log("cancel ID:", order.order_id);
    // Logic bổ sung để hiển thị lớp phủ chi tiết hoặc thực hiện các hành động khác
  };
  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
    setSelectedOrder(null);
  };
  const adressOrders = dataDetail.find(
    (find) => find.order_id === selectedOrder
  );
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };
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
              <th className="py-2 px-4 text-left text-gray-600">Mã Đơn Hàng</th>
              <th className="py-2 px-4 text-left text-gray-600">Tên,Địa chỉ</th>
              <th className="py-2 px-4 text-left text-gray-600">Trạng thái</th>
              <th className="py-2 px-4 text-left text-gray-600">
                Thời Gian Đặt Hàng
              </th>
              <th className="py-2 px-4 text-left text-gray-600">Hành động</th>
              <th className="py-2 px-4 text-left text-gray-600">
                Thời Gian Giao Hàng
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2 px-4">{order.maDH}</td>
                <td className="py-2 px-4">
                  {/* {order.nameTK},{`${order.shipping_address.slice(0, 20)}...`} */}
                  <div className="relative group">
                    <span className="absolute left-0 z-10 hidden w-max px-2 py-1 text-sm text-white bg-black rounded-lg group-hover:block">
                      {order.shipping_address}
                    </span>
                    {order.nameTK},{" "}
                    {`${order.shipping_address.slice(0, 20)}...`}
                  </div>
                </td>
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
                <td className="py-2 px-1 flex">
                  <button
                    className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
                    onClick={() => handleViewDetails(order)}
                  >
                    Xem chi tiết
                  </button>
                  {(order.trangthai === "Đang Xử Lí" ||
                    order.trangthai === "Đã thanh toán") && (
                    <>
                      <button
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Hủy
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="bg-white shadow-xl p-8 rounded-lg w-11/12 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Chi tiết đơn hàng
            </h2>
            <p className="mb-4 text-lg text-gray-600">
              <strong>Tên Người Đặt:</strong> {user.nameTK}
            </p>
            <p className="mb-4 text-lg text-gray-600">
              <strong>Số điện thoại:</strong> {user.phone}
            </p>
            <p className="mb-4 text-lg text-gray-600">
              <strong>Sản Phẩm:</strong>
            </p>
            <ul className="space-y-6">
              {dataDetail?.map((product, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300 hover:shadow-lg hover:border-blue-500 transition duration-300"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={`${
                        process.env.REACT_APP_SERVER_URL
                      }/src/uploads/avatarProducts/${
                        product.image_urls
                          ? product.image_urls.split(",")[0]
                          : null
                      }`}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col justify-center text-gray-700">
                    <div className="text-lg font-semibold">{product.Title}</div>
                    <div className="text-gray-500">
                      Giá:{" "}
                      {/* <span className="font-medium text-blue-500">
                        {product.Price}
                      </span> */}
                      <span className="font-medium text-blue-500">
                        {product.loaisanpham === "Sale" ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">
                              {formatCurrency(product.Price)}
                            </span>
                            <span className="text-red-500">
                              {formatCurrency(product.PriceSale)}
                            </span>
                          </>
                        ) : (
                          formatCurrency(product.Price)
                        )}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      Số lượng:{" "}
                      <span className="font-medium">{product.quantity}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={handleCloseOverlay}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCart;

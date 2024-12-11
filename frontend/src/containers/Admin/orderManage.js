import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/solid";
import OrderDetail from "./OrderDetail";
import axios from "axios";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tinhTrang, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  useEffect(() => {
    getOrders();
  }, [currentPage]);

  const getOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/order/findall`
      );
      console.log(orders);
      const allOrders = response.data;
      const startIndex = (currentPage - 1) * 5;
      const endIndex = startIndex + 5;
      const ordersOnCurrentPage = allOrders.slice(startIndex, endIndex);
      setOrders(ordersOnCurrentPage);
      const totalOrders = allOrders.length;
      const totalPages = Math.ceil(totalOrders / 5);
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

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId); // Cập nhật ID đơn hàng đã chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleUpdateOrderStatus = async (order_id) => {
    if (!order_id || !tinhTrang) {
      console.log("Missing order ID or status");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/order/update`,
        {
          order_id,
          tinhTrang: tinhTrang,
        }
      );

      if (response.status === 200) {
        console.log("Order status updated successfully");
        // Fetch updated orders without reloading the page
        getOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };
  // const handleChangeOrderStatus = (order) => {
  //   setSelectedOrder(order);
  //   setModalVisible(true);
  //   setStatus(order.orderStatus);
  // };

  // const handleformatDate = (order) => {
  //   const orderDate = new Date(order);
  //   const options = { day: "numeric", month: "short", year: "numeric" };
  //   const formattedDate = orderDate.toLocaleDateString("en-GB", options);
  //   return formattedDate;
  // };

  // const handleUpdateOrderStatus = () => {
  //   console.log("Updating order status:", selectedOrder.id, tinhTrang);
  //   setModalVisible(false);
  //   getOrders();
  // };

  // const handleModalCancel = () => {
  //   setSelectedOrder(null);
  //   setModalVisible(false);
  // };

  return (
    <div>
      <Card
        className="w-full mx-auto"
        style={{
          margin: "20px auto",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Orders
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Customer Orders
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Mã Đơn Hàng
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Tên Khách Hàng
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Số Điện Thoại
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Ngày Giao Hàng
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Địa Chỉ
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Tổng Giá
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Trạng Thái
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Hành Động
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    Cập Nhật Trạng Thái
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" className="font-normal">
                      {order.maDH}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" className="font-normal">
                      {order.nameTK}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" className="font-normal">
                      {order.phone}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" className="font-normal">
                      {new Date(order.order_date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      className="font-normal truncate overflow-hidden whitespace-nowrap line-clamp"
                    >
                      {/* {order.shipping_address}
                      {""} */}
                      {`${order.shipping_address.slice(0, 20)}...`}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" className="font-normal">
                      {formatCurrency(order.total_amount)}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      className="font-normal"
                      style={{
                        color:
                          order.trangthai === "pending"
                            ? "orange"
                            : order.trangthai === "completed"
                            ? "green"
                            : "red",
                      }}
                    >
                      {order.trangthai}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col items-center gap-2">
                      <Tooltip content="View Order">
                        <IconButton
                          variant="text"
                          style={{ color: "#7D879C", borderRadius: "50%" }}
                          onClick={() => handleViewOrder(order.order_id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                  {order.trangthai !== "Đã hủy" &&
                  order.trangthai !== "Đã Giao" ? (
                    <>
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="mt-2">
                          <Select
                            fullWidth
                            value={
                              selectedOrder === order.order_id
                                ? tinhTrang
                                : order.trangthai
                            }
                            onChange={(e) => {
                              setStatus(e.target.value);
                              setSelectedOrder(order.order_id);
                            }}
                            className="w-full"
                          >
                            <MenuItem value="Đang Xử Lí">Đang Xử Lí</MenuItem>
                            <MenuItem value="Đã Duyệt">Đã Duyệt</MenuItem>
                            <MenuItem value="Chờ Lấy Hàng">
                              Chờ Lấy Hàng
                            </MenuItem>
                            {/* <MenuItem value="Chờ Giao Hàng">
                              Chờ Giao Hàng
                            </MenuItem> */}
                            <MenuItem value="Đã Giao">Đã Giao</MenuItem>
                          </Select>
                        </div>
                      </td>

                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="mt-2">
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "10px" }}
                            onClick={() =>
                              handleUpdateOrderStatus(order.order_id)
                            }
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // If the status is 'Đã Giao' or 'Đã Hủy', show empty cells to keep table structure consistent
                    <>
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="mt-2">
                          <Select
                            fullWidth
                            value={order.trangthai}
                            disabled
                            className="w-full"
                          >
                            <MenuItem value="Đang Xử Lí">Đang Xử Lí</MenuItem>
                            <MenuItem value="Đã Duyệt">Đã Duyệt</MenuItem>
                            <MenuItem value="Chờ Lấy Hàng">
                              Chờ Lấy Hàng
                            </MenuItem>
                            <MenuItem value="Chờ Giao Hàng">
                              Chờ Giao Hàng
                            </MenuItem>
                            <MenuItem value="Đã Giao">Đã Giao</MenuItem>
                          </Select>
                        </div>
                      </td>

                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="mt-2">
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "10px" }}
                            disabled
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1001]">
              <div className="bg-white p-6 rounded-lg h-5/6 overflow-auto relative">
                <button
                  onClick={() => setIsModalOpen(false)} // Đóng modal
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <OrderDetail orderId={selectedOrderId} />{" "}
                {/* Hiển thị chi tiết đơn hàng */}
              </div>
            </div>
          )}
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button
            variant="text"
            color="blue-gray"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <IconButton
                key={index + 1}
                variant={currentPage === index + 1 ? "filled" : "text"}
                color="blue-gray"
                size="sm"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </IconButton>
            ))}
          </div>
          <Button
            variant="text"
            color="blue-gray"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderManage;

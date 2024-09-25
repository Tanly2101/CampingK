import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Select } from "antd";
import { Button, Textarea } from "@material-tailwind/react";
const { Meta } = Card;
const { Option } = Select;

const OrderDetail = ({ orderId }) => {
  // const [order, setOrder] = useState([]);
  const [data, setData] = useState([]);

  console.log(orderId);
  useEffect(() => {
    if (!orderId) return;
    const getProductOrder = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/order/productdt/${orderId}`
        );
        console.log(data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      getProductOrder();
    }
  }, [orderId]);

  //   const handleformatDate = (order) => {
  //     const orderDate = new Date(order);
  //     const options = { day: "numeric", month: "short", year: "numeric" };
  //     return orderDate.toLocaleDateString("en-GB", options);
  //   };

  // const handleCancelConfirmation = (id) => {
  //     if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
  //         handleCancel(id);
  //     }
  // };

  return (
    <div className="w-[72%] ml-auto m-5">
      {data &&
        data.map((orderItem) => (
          <Card
            key={orderItem.order_id}
            className="mt-4 border-none shadow-md p-5"
          >
            {/* Order Info Section */}
            <div className="flex justify-between mb-4">
              <p className="text-[#7D879C] text-lg">
                Order ID:{" "}
                <span className="text-black font-bold ml-1">
                  {orderItem.order_id}
                </span>
              </p>
              <p className="text-[#7D879C] text-lg">
                Order Date:{" "}
                <span className="text-black font-bold ml-1">
                  {new Date(orderItem.order_date).toLocaleDateString()}
                </span>
              </p>
              <p className="text-[#7D879C] text-lg">
                Shipping Address:{" "}
                <span className="text-black font-bold ml-1">
                  {orderItem.shipping_address}
                </span>
              </p>
            </div>

            {/* Order Status */}
            <div className="mb-4">
              <Select
                defaultValue={orderItem.trangthai}
                className="w-full md:w-[300px] h-[50px] bg-white border-gray-300"
                disabled
              >
                <Option value="1">Processing</Option>
                <Option value="2">Pending</Option>
                <Option value="3">Delivering</Option>
                <Option value="4">Delivered</Option>
              </Select>
            </div>

            {/* Product Info Section */}
            <h3 className="mt-4 mb-2 font-semibold text-lg">
              Products in Order:
            </h3>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card className="rounded-none p-4 mb-4 border-gray-200 shadow-sm">
                  <div className="">
                    <Link
                      to={`/SanPham/${orderItem.product_id}`}
                      className="text-blue-600 font-medium mr-4"
                    >
                      {orderItem.Title}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={`${
                        process.env.REACT_APP_SERVER_URL
                      }/src/uploads/avatarProducts/${
                        orderItem.image_urls && orderItem.image_urls.length > 0
                          ? orderItem.image_urls.split(",")[0]
                          : "default-image.jpg"
                      }`}
                      alt={orderItem.Title || "Product Image"}
                      className="w-[80px] h-[80px] object-cover rounded mr-4"
                    />
                    <Meta
                      title={`${orderItem.quantity} item(s)`}
                      description={`Total: $${orderItem.Price}.00`}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Summary Section */}
            <div className="flex flex-col md:flex-row justify-between mt-4">
              <Card className="w-full md:w-[48%] p-4 border-gray-200 shadow-sm">
                <div>
                  <p className="text-xl font-bold mb-2">Total Summary</p>
                  <p className="text-[#7D879C]">
                    Payment Method:{" "}
                    <span className="text-black font-bold ml-2.5">
                      {orderItem.payment_method || "N/A"}
                    </span>
                  </p>
                </div>
              </Card>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default OrderDetail;

const orderService = require("../services/orderService");

// import * as commentsService from "../services/commentsService";

export const createOrderController = async (req, res, next) => {
  try {
    const order = req.body;
    console.log(order);
    if (
      !order.customer_id ||
      !order.total_amount ||
      !order.trangthai ||
      !order.shipping_address ||
      !order.payment_method
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await orderService.createOrder(
      order.maDH,
      order.customer_id,
      order.total_amount,
      order.trangthai,
      order.shipping_address,
      order.payment_method
    );
    const productUpdates = [];
    console.log("order created successfully:", result);
    const order_id = await orderService.findOrderId();
    console.log("order created successfully:", order_id);
    const sanphamIds = order.sanpham.map((sanpham) => sanpham.id);
    console.log("Product IDs:", sanphamIds);
    const quantity = order.sanpham.map((sanpham) => Number(sanpham.amount));
    console.log("sanpham amounts:", quantity);
    for (const product of order.sanpham) {
      console.log("Processing product:", product);
      // Create order detail for each product
      await orderService.createOrderDetail(
        order_id,
        product.id,
        product.amount
      );
      productUpdates.push({
        product_id: product.id,
        quantity: product.amount,
      });
    }
    await orderService.updateQuantity(order_id, productUpdates);
    res.status(200).json({
      message: "order created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
    next(error);
  }
};

export const createOrderDetailController = async (req, res, next) => {
  try {
    const { order_id, product_id, quantity } = req.body;

    if (!order_id || !product_id || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await orderService.createOrderDetail(
      order_id,
      product_id,
      quantity
    );

    console.log("orderDetail created successfully:", result);
    res.status(200).json({
      message: "orderDetail created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
    next(error);
  }
};
export const findAllByCustomerId = async (req, res) => {
  const orderId = req.params.id; // Changed 'DH' to 'orderId' for clarity
  try {
    const order = await orderService.findProductById(orderId); // Await the result of the order service
    res.status(200).json(order); // Send the result as a JSON response with a 200 status
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error); // Log the error to the console
    res.status(500).json({ message: "Đã xảy ra lỗi." }); // Send a 500 status with an error message
  }
};
export const findAll = async (req, res) => {
  try {
    // Gọi hàm từ service để lấy đơn hàng
    const orders = await orderService.findAll();
    res.json(orders); // Trả về kết quả dưới dạng JSON
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Trả về lỗi nếu có sự cố
  }
};
export const cancelOrderController = async (req, res, next) => {
  try {
    const { id: order_id } = req.params;
    console.log(order_id);
    if (!order_id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    // Lấy thông tin sản phẩm từ đơn hàng
    const orderDetails = await orderService.getOrderDetails(order_id);
    console.log("Order details:", orderDetails);

    // Kiểm tra xem có chi tiết đơn hàng nào được tìm thấy không
    if (orderDetails.length === 0) {
      return res.status(404).json({
        message: "No order details found for the given order ID",
      });
    }

    // Cộng lại số lượng sản phẩm đã bán
    for (const detail of orderDetails) {
      await orderService.updateProductSold(detail.product_id, detail.quantity);
    }

    // Cập nhật trạng thái đơn hàng thành "cancelled"
    const result = await orderService.updateOrderStatus(order_id, "Đã hủy");

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found or already canceled",
      });
    }

    res.status(200).json({
      message: "Order canceled and products quantity reverted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error canceling order and reverting products quantity",
      error: error.message,
    });
    next(error);
  }
};
export const getOrdersByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    // Gọi hàm từ service để lấy dữ liệu đơn hàng
    const orders = await orderService.findAllId(customerId);

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer." });
    }
    // Trả về dữ liệu đơn hàng
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};
export const updateOrder = async (req, res, next) => {
  const { order_id, tinhTrang } = req.body;

  if (!order_id || tinhTrang === undefined) {
    return res.status(400).json({ message: "Missing order ID or status." });
  }

  try {
    // Cập nhật trạng thái đơn hàng
    const result = await orderService.updateOrderStatus(order_id, tinhTrang);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Nếu trạng thái là "Đã Giao", cập nhật số lượng đã bán và kho
    if (tinhTrang === "Đã Giao") {
      // Lấy thông tin chi tiết đơn hàng
      const orderDetails = await orderService.getOrderDetails(order_id);

      // Cập nhật số lượng đã bán và giảm số lượng trong kho
      for (const detail of orderDetails) {
        await orderService.updateProductDaban(
          detail.product_id,
          detail.quantity
        );
      }
      await orderService.updateOrderTime(order_id);
    }

    res.status(200).json({ message: "Order status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

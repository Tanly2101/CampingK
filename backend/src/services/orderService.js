const con = require("../Config/connectDatabase"); // Điều chỉnh đường dẫn tới mô hình User nếu cần

const randomOrderId = () => {
  const characters = "0123456789abcdxyz";
  const idLength = 6; // Độ dài của phần ngẫu nhiên (7 ký tự)
  let orderId = "#T"; // Tiền tố của ID

  // Tạo ngẫu nhiên các ký tự cho phần ngẫu nhiên
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderId += characters[randomIndex];
  }

  return orderId;
};

export const createOrder = async (
  maDH,
  customer_id,
  total_amount,
  trangthai,
  shipping_address,
  payment_method
) => {
  // Nếu order_id không được cung cấp, tạo order_id mới
  const generatedOrderId = maDH || randomOrderId();

  if (
    !customer_id ||
    !total_amount ||
    !trangthai ||
    !shipping_address ||
    !payment_method
  ) {
    throw new Error("One or more values are undefined");
  }

  const query = `
    INSERT INTO donhang (maDH, customer_id, order_date, total_amount, trangthai, shipping_address, payment_method)
    VALUES (?,?, NOW(), ?, ?, ?, ?)
  `;
  const values = [
    generatedOrderId,
    customer_id,
    total_amount,
    trangthai,
    shipping_address,
    payment_method,
  ];

  try {
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};
export const createOrderDetail = async (order_id, product_id, quantity) => {
  if (!order_id || !product_id || !quantity) {
    throw new Error("One or more values are undefined");
  }

  const query = `
    INSERT INTO chitietdonhang (order_id,product_id,quantity)
    VALUES (?,?,?)
  `;
  const values = [order_id, product_id, quantity];

  try {
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};
export const findOrderId = async () => {
  try {
    const [rows] = await con.query(`SELECT LAST_INSERT_ID() as order_id`);
    return rows[0].order_id; // Trả về ID của bản ghi mới
  } catch (error) {
    console.error("Error finding order ID:", error);
    throw error; // Ném lỗi để được xử lý ở nơi gọi hàm
  }
};

export const updateQuantity = async (order_id) => {
  // Check if orderId is provided
  if (typeof order_id !== "number" || isNaN(order_id)) {
    throw new Error("Invalid order ID");
  }

  // SQL query to update the sold quantity
  const query = `
    UPDATE sanpham
    JOIN chitietdonhang ON sanpham.id = chitietdonhang.product_id
    SET sanpham.sold = sanpham.sold - chitietdonhang.quantity
    WHERE sanpham.id = chitietdonhang.product_id AND chitietdonhang.order_id = ?;
  `;
  const values = [order_id]; // Pass the orderId as a parameter

  try {
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};
export const findProductById = async (order_id) => {
  const query = `
  SELECT
	ctdh.*,
  s.Title,
  s.Price,
  s.PriceSale,
  s.loaisanpham,
  GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.id ASC SEPARATOR ', ') AS image_urls,
  d.shipping_address,
  d.trangthai,
  d.order_date,
  d.payment_method
  FROM chitietdonhang ctdh
  JOIN sanpham s ON ctdh.product_id = s.id
  LEFT JOIN product_images pi ON s.id = pi.sanpham_id
  JOIN donhang d ON ctdh.order_id = d.order_id
  WHERE ctdh.order_id = ?
  GROUP BY s.Title, s.Price, d.shipping_address, d.trangthai, ctdh.quantity, s.PriceSale, s.loaisanpham;
  `;
  const values = [order_id]; // Define the values array with the order_id
  try {
    const [result] = await con.execute(query, values); // Pass the values array to the query
    console.log("Query result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
export const findAll = async () => {
  const query = `
    SELECT dh.*, kh.nameTK ,kh.phone
    FROM campingk.donhang AS dh
    JOIN campingk.khachhangs AS kh ON dh.customer_id = kh.id;
    `;
  try {
    // Thực hiện truy vấn với kết nối cơ sở dữ liệu
    const [rows] = await con.execute(query);
    return rows; // Trả về kết quả truy vấn
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
export const findAllId = async (customerId) => {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  const query = `
    SELECT dh.*, kh.nameTK
    FROM campingk.donhang AS dh
    JOIN campingk.khachhangs AS kh ON dh.customer_id = kh.id
    WHERE kh.id = ?;
  `;

  try {
    // Thực hiện truy vấn với kết nối cơ sở dữ liệu
    const [rows] = await con.execute(query, [customerId]);
    return rows; // Trả về kết quả truy vấn
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
export const getOrderDetails = async (order_id) => {
  const query = `
    SELECT product_id, quantity 
    FROM chitietdonhang 
    WHERE order_id = ?;
    `;
  const values = [order_id];
  try {
    // Thực hiện truy vấn với kết nối cơ sở dữ liệu
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result; // Trả về kết quả truy vấn
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
export const updateProductSold = async (product_id, quantity) => {
  const query = `
    UPDATE sanpham 
    SET sold = sold + ? 
    WHERE id = ?
    `;
  const values = [quantity, product_id];
  try {
    // Thực hiện truy vấn với kết nối cơ sở dữ liệu
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result; // Trả về kết quả truy vấn
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
export const updateProductDaban = async (product_id, quantity) => {
  const connection = await con.getConnection();
  try {
    // Cập nhật số lượng đã bán cho sản phẩm
    const [result] = await connection.execute(
      `
      UPDATE sanpham
      SET daban = COALESCE(daban, 0) + ?
      WHERE id = ?
    `,
      [quantity, product_id]
    );

    return result;
  } catch (error) {
    console.error("Error updating product sold quantity:", error);
    throw error;
  } finally {
    connection.release();
  }
};
export const updateOrderTime = async (order_id) => {
  const query = `
    UPDATE donhang 
    SET updated_at = NOW()
    WHERE order_id = ?
  `;
  const values = [order_id];
  try {
    // Thực hiện truy vấn với kết nối cơ sở dữ liệu
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result; // Trả về kết quả truy vấn
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
export const updateOrderStatus = async (order_id, trangthai) => {
  const query = `
    UPDATE donhang 
    SET trangthai = ? 
    WHERE order_id = ?
    `;
  const values = [trangthai, order_id];
  try {
    // Thực hiện truy vấn với kết nối cơ sở dữ liệu
    const [result] = await con.execute(query, values);
    console.log("Query result:", result);
    return result; // Trả về kết quả truy vấn
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

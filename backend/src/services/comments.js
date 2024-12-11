const con = require("../Config/connectDatabase"); // Điều chỉnh đường dẫn tới mô hình User nếu cần
// const util = require("util");
// // Route để lấy dữ liệu người dùng
// const queryAsync = util.promisify(con.query).bind(con);

export const createComments = async (
  LastName,
  PhoneComments,
  ContentComments,
  idsanpham,
  SaoDanhGia,
  customerId = null // Adding the SaoDanhGia parameter
) => {
  if (!LastName || !PhoneComments || !ContentComments || !SaoDanhGia) {
    throw new Error("One or more values are undefined");
  }

  const query = `
    INSERT INTO comments (LastName, PhoneComments, ContentComments, idsanpham, CreateAtComments, SaoDanhGia,customerId) 
    VALUES (?, ?, ?, ?, NOW(), ?,?)
  `;
  const values = [
    LastName,
    PhoneComments,
    ContentComments,
    idsanpham,
    SaoDanhGia,
    customerId,
  ]; // Adding SaoDanhGia to the values array

  try {
    const connection = await con.getConnection();
    const [result] = await connection.execute(query, values);
    connection.release();
    console.log("Query result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};
export const getCommentsByProductId = async (idsanpham) => {
  const connection = await con.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM comments WHERE idsanpham = ?",
      [idsanpham]
    );
    return rows; // Trả về tất cả các bản ghi có idsanpham
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
export const checkOrderVerification = async (customerId, idsanpham) => {
  const query = `
    SELECT d.order_id 
    FROM donhang d
    JOIN chitietdonhang ctdh ON d.order_id = ctdh.order_id
    WHERE d.customer_id = ? 
      AND ctdh.product_id = ? 
      AND d.trangthai = 'Đã giao'
  `;

  try {
    const [rows] = await con.execute(query, [customerId, idsanpham]);
    return rows.length > 0; // Nếu có đơn hàng hợp lệ, trả về true
  } catch (error) {
    console.error("Lỗi khi kiểm tra đơn hàng:", error);
    throw error; // Nếu có lỗi, ném ra ngoài để controller xử lý
  }
};

// Cập nhật cột Verified thành true cho bình luận đã tạo
export const updateVerifiedStatus = async (commentId) => {
  const query = `
    UPDATE comments
    SET Verified = true
    WHERE idComments = ?
  `;

  try {
    const [result] = await con.execute(query, [commentId]);
    return result;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái Verified:", error);
    throw error; // Nếu có lỗi, ném ra ngoài để controller xử lý
  }
};
export const hideComment = async (commentId) => {
  try {
    // Kiểm tra trạng thái hiện tại của bình luận
    const [rows] = await con.execute(
      "SELECT isHidden FROM comments WHERE idComments = ?",
      [commentId]
    );

    if (rows.length === 0) {
      throw new Error("Bình luận không tồn tại");
    }

    const isCurrentlyHidden = rows[0].isHidden;

    // Cập nhật trạng thái ẩn/hiện (nếu đang ẩn thì set thành hiện và ngược lại)
    const newVisibility = isCurrentlyHidden ? 0 : 1; // Nếu đang ẩn thì chuyển thành hiện (0), nếu đang hiện thì chuyển thành ẩn (1)

    const [updateResult] = await con.execute(
      "UPDATE comments SET isHidden = ? WHERE idComments = ?",
      [newVisibility, commentId]
    );

    return updateResult; // Trả về kết quả sau khi cập nhật
  } catch (error) {
    throw new Error(
      "Không thể thay đổi trạng thái bình luận: " + error.message
    );
  }
};

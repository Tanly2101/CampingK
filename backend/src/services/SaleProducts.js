const con = require("../Config/connectDatabase");
const moment = require("moment-timezone");
// Lấy sản phẩm khuyến mãi còn hiệu lực

// Lấy thời gian khuyến mãi hiện tại
export const getAllSaleRecords = async () => {
  try {
    // Query to select all records from the salesanpham table
    const [rows] = await con.query(`SELECT * FROM salesanpham`);

    // Convert UTC time to local time and format it
    const data = rows.map((record) => ({
      ...record,
      sale_start_time: moment
        .utc(record.sale_start_time)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss"),
      sale_end_time: moment
        .utc(record.sale_end_time)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    return data; // Return the transformed data
  } catch (error) {
    throw new Error(error.message); // Throw error to be caught by the controller
  }
};
// Xóa các sản phẩm khuyến mãi cũ đã hết hạn
export const removeOldSaleProducts = async () => {
  const connection = await con.getConnection();
  try {
    // Thực hiện câu lệnh xóa với JOIN
    const [result] = await connection.execute(`
      DELETE s
      FROM salesanpham s
      JOIN (
        SELECT id
        FROM salesanpham
        WHERE sale_end_time <= NOW()
      ) sub ON s.id = sub.id;
    `);

    // In số lượng bản ghi đã bị xóa
    console.log(`${result.affectedRows} rows deleted.`);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi xóa sản phẩm khuyến mãi:", error);
  } finally {
    // Giải phóng kết nối
    connection.release();
  }
};

// Thêm sản phẩm khuyến mãi mới
export const addSaleProducts = async () => {
  const connection = await con.getConnection();
  try {
    const now = new Date();
    const newEndTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Thời gian kết thúc mới

    // Xóa các sản phẩm khuyến mãi cũ
    await removeOldSaleProducts();
    const [existingSales] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM salesanpham
    `);

    // Kiểm tra nếu đã có 4 hoặc nhiều hơn sản phẩm trong bảng salesanpham
    if (existingSales[0].count >= 4) {
      console.log(
        "Đã có đủ 4 sản phẩm khuyến mãi. Không cần thêm sản phẩm mới."
      );
      return; // Thoát khỏi hàm nếu đã có đủ 4 sản phẩm
    }
    // Lấy 4 sản phẩm ngẫu nhiên có loaisanpham = 'Sale'
    const [products] = await connection.execute(`
      SELECT id
      FROM sanpham
      WHERE loaisanpham = 'Sale'
      ORDER BY RAND()
      LIMIT 4
    `);

    // Thêm các sản phẩm vào bảng salesanpham
    for (const product of products) {
      await connection.execute(
        `
        INSERT INTO salesanpham (SanPham_id, sale_start_time, sale_end_time)
        VALUES (?, NOW(), ?)
      `,
        [product.id, newEndTime]
      );
    }

    console.log("Cập nhật sản phẩm khuyến mãi thành công.");
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm khuyến mãi:", error);
  } finally {
    connection.release();
  }
};

// Cập nhật thời gian khuyến mãi mới

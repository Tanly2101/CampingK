const con = require("../Config/connectDatabase"); // Điều chỉnh đường dẫn tới mô hình User nếu cần

// Route để lấy dữ liệu người dùng
export const checkAccount = async (phone) => {
  try {
    // Kết nối tới cơ sở dữ liệu
    const connection = await con.getConnection();

    // Sử dụng placeholder (?) để truyền giá trị `phone` vào truy vấn một cách an toàn
    const [rows, fields] = await connection.query(
      `SELECT * FROM khachhangs WHERE phone = ?`,
      [phone]
    );

    // Giải phóng kết nối sau khi truy vấn xong
    connection.release();

    // Trả về kết quả truy vấn
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const createAccount = async (nameTK, phone, password) => {
  try {
    const connection = await con.getConnection();
    const query = `
      INSERT INTO khachhangs (nameTK, phone, password, vaitro, createdAt) 
      VALUES (?, ?, ?, 2, NOW())
    `;
    const [result] = await connection.query(query, [nameTK, phone, password]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const getAvatarById = async (userId) => {
  const connection = await con.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT anhdaidien FROM khachhangs WHERE id = ?",
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
export const getAll = async () => {
  const connection = await con.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM khachhangs ");
    connection.release();
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
export const updateRoleById = async (userId) => {
  try {
    const [result] = await con.query(
      `UPDATE khachhangs
       SET vaitro = CASE
         WHEN vaitro = '1' THEN '2'
         WHEN vaitro = '2' THEN '1'
         ELSE vaitro
       END
       WHERE id = ?`,
      [userId]
    );
    return result;
  } catch (error) {
    throw new Error("Error updating role in database");
  }
};
export const getUserById = async (userId) => {
  try {
    const [rows] = await con.query(
      "SELECT password FROM khachhangs WHERE id = ?",
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw new Error("Failed to fetch user by ID");
  }
};

export const updatePassword = async (userId, hashedPassword) => {
  try {
    const [result] = await con.query(
      "UPDATE khachhangs SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw new Error("Failed to update password");
  }
};

const con = require("../Config/connectDatabase"); // Update this path as needed

export const createCart = async (idkhachhang, tongtien) => {
  if (!idkhachhang || !tongtien) {
    throw new Error("One or more values are undefined");
  }

  const query = `
    INSERT INTO giohang (idkhachhang, tongtien) 
    VALUES (?,?)
  `;
  const values = [idkhachhang, tongtien];

  try {
    const connection = await con.getConnection();
    const [result] = await connection.execute(query, values);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
export const getCartById = async (id) => {
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.query(
      `
      SELECT sp.*, gh.soluong,gh.IDsanpham
      FROM sanpham sp
      JOIN giohang gh ON sp.id = gh.IDsanpham
      WHERE gh.IDkhachhang = ?
      `,
      [id]
    );
    connection.release();
    return rows; // Trả về tất cả các hàng phù hợp, không chỉ hàng đầu tiên
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const deleteCartItem = async (idCart) => {
  try {
    const connection = await con.getConnection();
    const [result] = await connection.query(
      "DELETE FROM giohang WHERE idCart = ?",
      [idCart]
    );
    connection.release();
    return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};

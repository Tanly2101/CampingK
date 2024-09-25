const con = require("../Config/connectDatabase");

export const findAll = async () => {
  try {
    const connection = await con.getConnection();
    const [rows, fields] = await connection.query(`
              SELECT * FROM loaisanpham
          `);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const findcategory = async () => {
  try {
    const connection = await con.getConnection();
    const [rows, fields] = await connection.query(`
               SELECT * FROM loaisanphamphu
          `);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const findcategoryPhuId = async (idloaisanpham) => {
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.query(
      `
      SELECT *
      FROM loaisanphamphu
      WHERE idloaisanpham = ?`,
      [idloaisanpham]
    ); // Sử dụng idloaisanpham làm tham số truy vấn
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};

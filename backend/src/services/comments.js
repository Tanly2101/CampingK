const con = require("../Config/connectDatabase"); // Điều chỉnh đường dẫn tới mô hình User nếu cần
// const util = require("util");
// // Route để lấy dữ liệu người dùng
// const queryAsync = util.promisify(con.query).bind(con);

export const createComments = async (
  LastName,
  PhoneComments,
  ContentComments,
  idsanpham,
  SaoDanhGia // Adding the SaoDanhGia parameter
) => {
  if (!LastName || !PhoneComments || !ContentComments || !SaoDanhGia) {
    throw new Error("One or more values are undefined");
  }

  const query = `
    INSERT INTO comments (LastName, PhoneComments, ContentComments, idsanpham, CreateAtComments, SaoDanhGia) 
    VALUES (?, ?, ?, ?, NOW(), ?)
  `;
  const values = [
    LastName,
    PhoneComments,
    ContentComments,
    idsanpham,
    SaoDanhGia,
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

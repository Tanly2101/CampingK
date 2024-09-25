const con = require("../Config/connectDatabase"); // Điều chỉnh đường dẫn tới mô hình User nếu cần

export const createPost = async (title, description, userID) => {
  if (!title || !description || !userID) {
    throw new Error("One or more values are undefined");
  }

  const query = `
    INSERT INTO dangtins (title, description, userID, createdAt) 
    VALUES (?, ?, ?, NOW())
  `;
  const values = [title, description, userID];

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

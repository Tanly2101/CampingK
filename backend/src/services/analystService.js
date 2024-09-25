const con = require("../Config/connectDatabase");

export const findTotalOrderSale = async () => {
  const query = `
    SELECT SUM(cd.quantity) AS tongsanpham
    FROM chitietdonhang cd
    INNER JOIN donhang dh ON cd.order_id = dh.order_id
    WHERE dh.trangthai = 'Đã Giao'
`;
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.execute(query);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Propagate the error to be handled by the controller
  }
};
export const findTotalOrder = async () => {
  const query = `
    SELECT count(order_id) as tongDon 
    FROM donhang 
    WHERE trangthai = 'Đã Giao';
`;
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.execute(query);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Propagate the error to be handled by the controller
  }
};
export const findRevenueMonth = async () => {
  const query = `
    SELECT 
    MONTH(MAX(dh.updated_at)) AS month_number,
    IFNULL(SUM(sp.Price * cd.quantity), 0) AS revenue,
    IFNULL(SUM((sp.Price - sp.gianhap) * cd.quantity), 0) AS profit,
    COUNT(DISTINCT dh.order_id) * 30000 AS shipping_cost
FROM 
    (SELECT MONTH(CURDATE()) AS month_number) AS current_month
LEFT JOIN 
    donhang dh ON MONTH(dh.updated_at) = current_month.month_number
LEFT JOIN 
    chitietdonhang cd ON cd.order_id = dh.order_id
LEFT JOIN 
    sanpham sp ON cd.product_id = sp.id
WHERE 
    dh.trangthai = 'Đã Giao';
`;
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.execute(query);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Propagate the error to be handled by the controller
  }
};

export const sumOrderInDay = async (day) => {
  const query = `
    SELECT 
      DATE(updated_at) AS ngay, 
      SUM(total_amount) AS tongtien
    FROM 
      donhang
    WHERE 
      DATE(updated_at) = ? AND trangthai = 'Đã Giao'
    GROUP BY 
      DATE(updated_at);
  `;

  try {
    const connection = await con.getConnection();
    const [rows] = await connection.execute(query, [day]);
    connection.release();
    return rows[0] || { ngay: day, tongtien: 0 }; // Trả về 0 nếu không có kết quả
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Propagate the error to be handled by the controller
  }
};
export const findAllRevenue = async () => {
  const query = `
        SELECT 
    months.month_year,
    COUNT(DISTINCT dh.order_id) AS sodonhang,
    IFNULL(SUM(sp.Price * cd.quantity), 0) AS revenue,
    IFNULL(SUM(sp.gianhap * cd.quantity), 0) AS expense,
    IFNULL(SUM(sp.Price * cd.quantity) - SUM(sp.gianhap * cd.quantity), 0) AS profit,
    COUNT(DISTINCT dh.order_id) * 30000 AS total_shipping_cost
    FROM 
    (
        SELECT 
            DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%m') AS month_year
        FROM 
            (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
             UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 
             UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS numbers
    ) AS months
LEFT JOIN 
    donhang dh ON DATE_FORMAT(dh.updated_at, '%m') = months.month_year AND dh.trangthai = 'Đã Giao'
LEFT JOIN 
    chitietdonhang cd ON cd.order_id = dh.order_id
LEFT JOIN 
    sanpham sp ON cd.product_id = sp.id
GROUP BY 
    months.month_year
ORDER BY 
    months.month_year;
  `;

  try {
    const connection = await con.getConnection();
    const [rows] = await connection.execute(query);
    connection.release();
    return rows; // Trả về 0 nếu không có kết quả
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Propagate the error to be handled by the controller
  }
};

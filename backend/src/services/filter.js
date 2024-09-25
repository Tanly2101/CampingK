const con = require("../Config/connectDatabase");

export const findAllByBrand = async () => {
  try {
    const connection = await con.getConnection();
    const [rows, fields] = await connection.query(
      `
        SELECT * FROM brand 
        `
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const findAllNameByBrand = async (brandId) => {
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.query(
      `
      SELECT 
        sp.*,
        COALESCE(d.SoLuongDanhGia, 0) AS SoLuongDanhGia,
        COALESCE(d.DiemDanhGiaTrungBinh, 0) AS DiemDanhGiaTrungBinh,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_url ASC) AS HinhAnh
      FROM 
        sanpham sp
      LEFT JOIN 
        (
          SELECT 
            c.idsanpham,
            COUNT(c.idsanpham) AS SoLuongDanhGia,
            ROUND(AVG(c.SaoDanhGia), 1) AS DiemDanhGiaTrungBinh
          FROM 
            comments c
          GROUP BY 
            c.idsanpham
        ) d ON sp.id = d.idsanpham
      LEFT JOIN 
        product_images pi ON sp.id = pi.sanpham_id
      LEFT JOIN 
        brand b ON sp.thuonghieu = b.id
      WHERE 
        b.id = ?
      GROUP BY 
        sp.id;
      `,
      [brandId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};

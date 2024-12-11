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

export const findcategoryPhuName = async (nameCategoryPhu) => {
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
      WHERE 
        sp.nameCategoryPhu = ?
      GROUP BY 
        sp.id;`,
      [nameCategoryPhu]
    ); // Sử dụng idloaisanpham làm tham số truy vấn
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const getProductsByFilters = async (filters) => {
  const { idCategory, brandId, Price } = filters;
  const connection = await con.getConnection();

  try {
    let query = `
      SELECT 
        sp.*,
        COALESCE(d.SoLuongDanhGia, 0) AS SoLuongDanhGia,
        COALESCE(d.DiemDanhGiaTrungBinh, 0) AS DiemDanhGiaTrungBinh,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_url ASC) AS HinhAnh
      FROM
        sanpham sp
      LEFT JOIN (
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
      WHERE 1`;

    const params = [];

    if (idCategory) {
      query += ` AND sp.idCategory = ?`;
      params.push(idCategory);
    }

    if (brandId) {
      query += ` AND sp.thuonghieu = ?`;
      params.push(brandId);
    }

    // Cải thiện logic lọc giá
    if (Price) {
      switch (Price.toString()) {
        case "100000":
          query += ` AND sp.Price < ?`;
          params.push(100000);
          break;
        case "500000":
          query += ` AND sp.Price >= ? AND sp.Price < ?`;
          params.push(100000, 500000);
          break;
        case "2000000":
          query += ` AND sp.Price >= ? AND sp.Price < ?`;
          params.push(500000, 2000000);
          break;
        case "2000001":
          query += ` AND sp.Price >= ?`;
          params.push(2000000);
          break;
      }
    }

    query += " GROUP BY sp.id";

    const [rows] = await connection.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

// export const getProductsByCategoryAndPrice = async (idCategory, Price) => {
//   const connection = await con.getConnection();
//   try {
//     let query = `
//       SELECT
//         sp.*,
//         COALESCE(d.SoLuongDanhGia, 0) AS SoLuongDanhGia,
//         COALESCE(d.DiemDanhGiaTrungBinh, 0) AS DiemDanhGiaTrungBinh,
//         GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_url ASC) AS HinhAnh
//       FROM
//         sanpham sp
//       LEFT JOIN (
//         SELECT
//           c.idsanpham,
//           COUNT(c.idsanpham) AS SoLuongDanhGia,
//           ROUND(AVG(c.SaoDanhGia), 1) AS DiemDanhGiaTrungBinh
//         FROM
//           comments c
//         GROUP BY
//           c.idsanpham
//       ) d ON sp.id = d.idsanpham
//       LEFT JOIN
//         product_images pi ON sp.id = pi.sanpham_id
//       WHERE
//         sp.idCategory = ? AND `;

//     const priceConditions = {
//       100000: "sp.Price <= ?",
//       500000: "sp.Price > 100000 AND sp.Price <= ?",
//       2000000: "sp.Price > 500000 AND sp.Price <= ?",
//       2000001: "sp.Price > 2000000",
//     };

//     query += priceConditions[Price];
//     const params = [idCategory];
//     if (Price !== 2000001) params.push(Price);

//     query += " GROUP BY sp.id";
//     const [rows] = await connection.query(query, params);
//     return rows;
//   } catch (error) {
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// export const getProductsByBrandAndPrice = async (brandId, Price) => {
//   const connection = await con.getConnection();
//   try {
//     let query = `
//       SELECT
//         sp.*,
//         COALESCE(d.SoLuongDanhGia, 0) AS SoLuongDanhGia,
//         COALESCE(d.DiemDanhGiaTrungBinh, 0) AS DiemDanhGiaTrungBinh,
//         GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_url ASC) AS HinhAnh
//       FROM
//         sanpham sp
//       LEFT JOIN (
//         SELECT
//           c.idsanpham,
//           COUNT(c.idsanpham) AS SoLuongDanhGia,
//           ROUND(AVG(c.SaoDanhGia), 1) AS DiemDanhGiaTrungBinh
//         FROM
//           comments c
//         GROUP BY
//           c.idsanpham
//       ) d ON sp.id = d.idsanpham
//       LEFT JOIN
//         product_images pi ON sp.id = pi.sanpham_id
//       WHERE
//         sp.thuonghieu = ? AND `;

//     const priceConditions = {
//       100000: "sp.Price <= ?",
//       500000: "sp.Price > 100000 AND sp.Price <= ?",
//       2000000: "sp.Price > 500000 AND sp.Price <= ?",
//       2000001: "sp.Price > 2000000",
//     };

//     query += priceConditions[Price];
//     const params = [brandId];
//     if (Price !== 2000001) params.push(Price);

//     query += " GROUP BY sp.id";
//     const [rows] = await connection.query(query, params);
//     return rows;
//   } catch (error) {
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// export const getProductsByCategoryBrandAndPrice = async (
//   idCategory,
//   brandId,
//   Price
// ) => {
//   const connection = await con.getConnection();
//   try {
//     let query = `
//       SELECT
//         sp.*,
//         COALESCE(d.SoLuongDanhGia, 0) AS SoLuongDanhGia,
//         COALESCE(d.DiemDanhGiaTrungBinh, 0) AS DiemDanhGiaTrungBinh,
//         GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_url ASC) AS HinhAnh
//       FROM
//         sanpham sp
//       LEFT JOIN (
//         SELECT
//           c.idsanpham,
//           COUNT(c.idsanpham) AS SoLuongDanhGia,
//           ROUND(AVG(c.SaoDanhGia), 1) AS DiemDanhGiaTrungBinh
//         FROM
//           comments c
//         GROUP BY
//           c.idsanpham
//       ) d ON sp.id = d.idsanpham
//       LEFT JOIN
//         product_images pi ON sp.id = pi.sanpham_id
//       WHERE
//         sp.idCategory = ? AND sp.thuonghieu = ? AND `;

//     const priceConditions = {
//       100000: "sp.Price <= ?",
//       500000: "sp.Price > 100000 AND sp.Price <= ?",
//       2000000: "sp.Price > 500000 AND sp.Price <= ?",
//       2000001: "sp.Price > 2000000",
//     };

//     query += priceConditions[Price];
//     const params = [idCategory, brandId];
//     if (Price !== 2000001) params.push(Price);

//     query += " GROUP BY sp.id";
//     const [rows] = await connection.query(query, params);
//     return rows;
//   } catch (error) {
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

const con = require("../Config/connectDatabase");

export const findAll = async () => {
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.query(`
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
GROUP BY 
    sp.id;
    `);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};

export const findAllByName = async (Title) => {
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
    sp.Title LIKE ?
GROUP BY 
    sp.id;
      `,
      [`%${Title}%`]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const getProductById = async (id) => {
  try {
    const connection = await con.getConnection();

    const [rows] = await connection.query(
      `SELECT 
        sp.*,
        COALESCE(d.SoLuongDanhGia, 0) AS SoLuongDanhGia,
        ROUND(COALESCE(d.DiemDanhGiaTrungBinh, 1), 1) AS DiemDanhGiaTrungBinh,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_url ASC) AS HinhAnh,
        COALESCE(r.SoLuong5Sao, 0) AS SoLuong5Sao,
        COALESCE(r.SoLuong4Sao, 0) AS SoLuong4Sao,
        COALESCE(r.SoLuong3Sao, 0) AS SoLuong3Sao,
        COALESCE(r.SoLuong2Sao, 0) AS SoLuong2Sao,
        COALESCE(r.SoLuong1Sao, 0) AS SoLuong1Sao
      FROM 
        sanpham sp
      LEFT JOIN 
        (SELECT 
          idsanpham,
          COUNT(idsanpham) AS SoLuongDanhGia,
          AVG(SaoDanhGia) AS DiemDanhGiaTrungBinh
         FROM comments
         GROUP BY idsanpham
        ) d ON sp.id = d.idsanpham
      LEFT JOIN 
        product_images pi ON sp.id = pi.sanpham_id
      LEFT JOIN 
        (SELECT 
          idsanpham,
          SUM(CASE WHEN SaoDanhGia = 5 THEN 1 ELSE 0 END) AS SoLuong5Sao,
          SUM(CASE WHEN SaoDanhGia = 4 THEN 1 ELSE 0 END) AS SoLuong4Sao,
          SUM(CASE WHEN SaoDanhGia = 3 THEN 1 ELSE 0 END) AS SoLuong3Sao,
          SUM(CASE WHEN SaoDanhGia = 2 THEN 1 ELSE 0 END) AS SoLuong2Sao,
          SUM(CASE WHEN SaoDanhGia = 1 THEN 1 ELSE 0 END) AS SoLuong1Sao
         FROM comments
         GROUP BY idsanpham
        ) r ON sp.id = r.idsanpham
      WHERE 
        sp.id = ?
      GROUP BY 
        sp.id`,
      [id]
    );

    connection.release();

    if (rows.length === 0) {
      throw new Error(`Sản phẩm với ID ${id} không tìm thấy`);
    }

    return rows[0];
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const getProductsByCategory = async (idCategory) => {
  try {
    const connection = await con.getConnection();
    const [rows] = await connection.query(
      ` SELECT 
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
        sp.idCategory = ?
      GROUP BY 
        sp.id;`,
      [idCategory]
    );
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};
export const getProductsByPrice = async (Price) => {
  try {
    const connection = await con.getConnection();

    // Xây dựng câu truy vấn SQL
    let query = `
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
    `;

    // Thêm điều kiện lọc theo giá nếu có
    const priceConditions = {
      100000: "sp.Price <= ?",
      500000: "sp.Price > 100000 AND sp.Price <= ?",
      2000000: "sp.Price > 500000 AND sp.Price <= ?",
      2000001: "sp.Price > 2000000",
    };

    const params = [];
    if (Price) {
      query += " WHERE " + priceConditions[Price];
      if (Price !== 2000001) params.push(Price);
    }

    // Thêm GROUP BY sau WHERE
    query += " GROUP BY sp.id";

    // console.log("Query:", query); // In câu truy vấn
    // console.log("Params:", params); // In các tham số

    // Thực thi truy vấn SQL
    const [rows] = await connection.query(query, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};

// export const deleteProducts = async (productId) => {
//   let connection;
//   try {
//     connection = await con.getConnection();
//     const [result] = await connection.execute(
//       "DELETE FROM sanpham WHERE id = ?",
//       [productId]
//     );
//     connection.release();
//     return result;
//   } catch (error) {
//     console.error("Đã xảy ra lỗi:", error);
//     throw error;
//   }
// };
export const toggleProductStatus = async (productId) => {
  let connection;
  try {
    connection = await con.getConnection();

    // Lấy trạng thái hiện tại của sản phẩm
    const [rows] = await connection.execute(
      "SELECT loaisanpham FROM sanpham WHERE id = ?",
      [productId]
    );

    if (rows.length === 0) {
      throw new Error("Product not found");
    }

    // Xác định trạng thái mới
    const currentStatus = rows[0].loaisanpham;
    const newStatus =
      currentStatus === "Ngưng kinh doanh" ? "new" : "Ngưng kinh doanh";

    // Cập nhật trạng thái mới
    const [result] = await connection.execute(
      "UPDATE sanpham SET loaisanpham = ? WHERE id = ?",
      [newStatus, productId]
    );

    connection.release();
    return result;
  } catch (error) {
    console.error("Error updating product status:", error);
    if (connection) connection.release();
    throw error;
  }
};
export const createProduct = async (
  Title,
  Images, // Giả sử Images là mảng các URL hình ảnh
  Description,
  Price,
  loaisanpham,
  sold,
  thuonghieu,
  idCategory,
  gianhap,
  chitiet,
  nameCategoryPhu // Thêm trường Details cho chi tiết sản phẩm
) => {
  if (!Title || !Price || !idCategory) {
    throw new Error("Some required fields are missing");
  }

  // console.log("Dữ liệu đầu vào:", {
  //   Title,
  //   Images,
  //   Description,
  //   Price,
  //   loaisanpham,
  //   sold,
  //   thuonghieu,
  //   idCategory,
  //   gianhap,
  //   chitiet,
  //   nameCategoryPhu, // Hiển thị Details để kiểm tra
  // });

  // Câu lệnh SQL để thêm sản phẩm vào bảng sanpham
  const insertProductQuery = `
    INSERT INTO sanpham (Title, Description, Price, loaisanpham, sold, thuonghieu, idCategory, gianhap, chitiet,nameCategoryPhu)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Câu lệnh SQL để thêm hình ảnh vào bảng product_images
  const insertImagesQuery = `
    INSERT INTO product_images (sanpham_id, image_url)
    VALUES (?, ?)
  `;

  // Mảng giá trị cho bảng sanpham, thêm Details vào cuối
  const valuesProduct = [
    Title,
    Description,
    Price,
    loaisanpham,
    sold,
    thuonghieu,
    idCategory,
    gianhap,
    chitiet,
    nameCategoryPhu, // Thêm Details vào mảng giá trị
  ];

  try {
    const connection = await con.getConnection();

    // Thêm sản phẩm vào bảng sanpham
    const [resultProduct] = await connection.execute(
      insertProductQuery,
      valuesProduct
    );
    const productId = resultProduct.insertId;

    console.log("Product created:", resultProduct);

    // Thêm hình ảnh vào bảng product_images
    if (Images && Images.length > 0) {
      for (const imageUrl of Images) {
        const valuesImages = [productId, imageUrl];
        await connection.execute(insertImagesQuery, valuesImages);
      }
    }

    await connection.release();

    return resultProduct;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};

export const ProductsDetailId = async (productId) => {
  let connection;
  try {
    connection = await con.getConnection();
    const [result] = await connection.execute(
      "SELECT * FROM sanpham WHERE id = ?",
      [productId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    throw error;
  }
};

// export const updateProducts = async ({
//   Title,
//   Images,
//   Description,
//   Price,
//   loaisanpham,
//   sold,
//   thuonghieu,
//   idCategory,
//   idSP,
//   gianhap,
// }) => {
//   try {
//     // Kết nối đến cơ sở dữ liệu
//     const connection = await con.getConnection();

//     // Khởi tạo câu lệnh SQL để cập nhật sản phẩm
//     const updateProductQuery = `
//         UPDATE sanpham
//         SET
//           Title = COALESCE(?, Title),
//           Description = COALESCE(?, Description),
//           Price = COALESCE(?, Price),
//           loaisanpham = COALESCE(?, loaisanpham),
//           sold = COALESCE(?, sold),
//           thuonghieu = COALESCE(?, thuonghieu),
//           idCategory = COALESCE(?, idCategory),
//           gianhap = COALESCE(NULLIF(?, 'null'), gianhap)
//         WHERE id = ?;
//     `;

//     // Chuẩn bị các giá trị để truyền vào câu lệnh SQL
//     const productValues = [
//       Title || null,
//       Description || null,
//       Price || null,
//       loaisanpham || null,
//       sold || null,
//       thuonghieu || null,
//       idCategory || null,
//       gianhap || null, // Thêm gianhap vào danh sách giá trị
//       idSP,
//     ];

//     // Thực thi câu lệnh SQL để cập nhật sản phẩm
//     await connection.execute(updateProductQuery, productValues);

//     // Nếu có ảnh mới, xử lý việc cập nhật ảnh
//     if (Images && Images.length > 0) {
//       // Xóa tất cả ảnh hiện tại của sản phẩm
//       const deleteImagesQuery = `
//         DELETE FROM product_images
//         WHERE sanpham_id = ?;
//       `;
//       await connection.execute(deleteImagesQuery, [idSP]);

//       // Thêm các ảnh mới vào bảng product_images
//       const insertImageQuery = `
//         INSERT INTO product_images (sanpham_id, image_url)
//         VALUES (?, ?);
//       `;
//       for (const imageUrl of Images) {
//         const imageValues = [idSP, imageUrl];
//         await connection.execute(insertImageQuery, imageValues);
//       }
//     }

//     // Giải phóng kết nối
//     await connection.release();

//     // Trả về kết quả
//     return { message: "Product updated successfully" };
//   } catch (error) {
//     // Nếu có lỗi, ném lỗi để controller xử lý
//     console.error("Error updating product:", error);
//     throw error;
//   }
// };
export const updateProducts = async ({
  Title,
  Images,
  Description,
  Price,
  PriceSale,
  loaisanpham,
  sold,
  thuonghieu,
  idCategory,
  idSP,
  gianhap,
  chitiet,
  nameCategoryPhu,
}) => {
  try {
    // Kết nối đến cơ sở dữ liệu
    const connection = await con.getConnection();

    // Khởi tạo câu lệnh SQL để cập nhật sản phẩm
    const updateProductQuery = `
        UPDATE sanpham
        SET 
          Title = COALESCE(?, Title),
          Description = COALESCE(?, Description),
          Price = COALESCE(?, Price),
          PriceSale = COALESCE(?, PriceSale),
          loaisanpham = COALESCE(?, loaisanpham),
          sold = COALESCE(?, sold),
          thuonghieu = COALESCE(?, thuonghieu),
          idCategory = COALESCE(?, idCategory),
          nameCategoryPhu = COALESCE(NULLIF(?, ''), ''),
          gianhap = COALESCE(NULLIF(?, 'null'), gianhap),
          chitiet = COALESCE(NULLIF(?, 'null'), chitiet) 
        WHERE id = ?;
    `;

    // Chuẩn bị các giá trị để truyền vào câu lệnh SQL
    const productValues = [
      Title || null,
      Description || null,
      Price || null,
      PriceSale || null, // Add PriceSale to the list
      loaisanpham || null,
      sold || null,
      thuonghieu || null,
      idCategory || null,
      nameCategoryPhu || null,
      gianhap || null,
      chitiet || null, // Thêm Details vào danh sách giá trị
      idSP,
    ];

    // Thực thi câu lệnh SQL để cập nhật sản phẩm
    await connection.execute(updateProductQuery, productValues);

    // Nếu có ảnh mới, xử lý việc cập nhật ảnh
    if (Images && Images.length > 0) {
      // Xóa tất cả ảnh hiện tại của sản phẩm
      const deleteImagesQuery = `
        DELETE FROM product_images
        WHERE sanpham_id = ?;
      `;
      await connection.execute(deleteImagesQuery, [idSP]);

      // Thêm các ảnh mới vào bảng product_images
      const insertImageQuery = `
        INSERT INTO product_images (sanpham_id, image_url)
        VALUES (?, ?);
      `;
      for (const imageUrl of Images) {
        const imageValues = [idSP, imageUrl];
        await connection.execute(insertImageQuery, imageValues);
      }
    }

    // Giải phóng kết nối
    await connection.release();

    // Trả về kết quả
    return { message: "Product updated successfully" };
  } catch (error) {
    // Nếu có lỗi, ném lỗi để controller xử lý
    console.error("Error updating product:", error);
    throw error;
  }
};

export const addRecentlyViewedProduct = async (productId) => {
  try {
    // Kiểm tra xem sản phẩm đã có trong danh sách chưa
    const [existingProduct] = await con.execute(
      `SELECT * FROM sanphamganday WHERE product_id = ?`,
      [productId]
    );

    if (existingProduct.length > 0) {
      // Nếu sản phẩm đã tồn tại, cập nhật thời gian xem gần đây
      await con.execute(
        `UPDATE sanphamganday SET viewed_at = NOW() WHERE product_id = ?`,
        [productId]
      );
      console.log("Product updated in recently viewed list.");
      return { message: "Product updated in recently viewed list" };
    }

    // Thêm sản phẩm mới vào danh sách
    await con.execute(
      `INSERT INTO sanphamganday (product_id, viewed_at) VALUES (?, NOW())`,
      [productId]
    );

    // Giới hạn danh sách còn 5 sản phẩm mới nhất
    await con.execute(`
     DELETE FROM sanphamganday
  WHERE id NOT IN (
    SELECT id FROM (
      SELECT id
      FROM sanphamganday
      ORDER BY viewed_at DESC
      LIMIT 5
    ) AS temp
  )
    `);

    return { message: "Product added to recently viewed list" };
  } catch (error) {
    console.error("Error adding product to recently viewed:", error);
    throw error; // Ném lỗi để xử lý ở cấp cao hơn
  }
};

export const getRecentlyViewedProducts = async () => {
  const [products] = await con.execute(
    `SELECT p.id, p.Title, p.Price, rv.viewed_at, 
            GROUP_CONCAT(pi.image_url ORDER BY pi.id) AS image_urls
     FROM sanphamganday rv
     JOIN sanpham p ON rv.product_id = p.id
     LEFT JOIN product_images pi ON p.id = pi.sanpham_id
     GROUP BY p.id
     ORDER BY rv.viewed_at DESC`
  );
  return products.map((product) => ({
    ...product,
    image_urls: product.image_urls ? product.image_urls.split(",") : [],
  }));
};

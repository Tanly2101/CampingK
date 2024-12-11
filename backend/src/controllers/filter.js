const filterService = require("../services/filter");
export const findAllByBrand = async (req, res) => {
  try {
    let data = await filterService.findAllByBrand();
    res.json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const findProductByBrand = async (req, res) => {
  const { idthuonghieu } = req.params; // Lấy ID từ tham số URL
  try {
    // Gọi dịch vụ để lấy sản phẩm theo ID
    const product = await filterService.findAllNameByBrand(idthuonghieu);

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    // Trả về thông tin sản phẩm nếu tìm thấy
    res.json(product);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    // Trả về lỗi server nếu có lỗi xảy ra
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
  }
};
export const findCategoryPhuByName = async (req, res) => {
  const { NameCategory } = req.params; // Lấy name từ params của request

  try {
    const categories = await filterService.findcategoryPhuName(NameCategory); // Gọi hàm để lấy danh mục phụ theo id
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm danh mục phụ." });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy dữ liệu." });
  }
};
export const getFilteredProducts = async (req, res) => {
  try {
    const filters = req.query; // Extract filters from query parameters

    // Call the function to get products based on filters
    const products = await filterService.getProductsByFilters(filters);

    // Send back the filtered products as the response
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const filterByCategoryAndPrice = async (req, res) => {
//   try {
//     const { idCategory, Price } = req.query;
//     const products = await filterService.getProductsByCategoryAndPrice(
//       idCategory,
//       Number(Price)
//     );
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const filterByBrandAndPrice = async (req, res) => {
//   try {
//     const { idthuonghieu, Price } = req.query;
//     const products = await filterService.getProductsByBrandAndPrice(
//       idthuonghieu,
//       Number(Price)
//     );
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const filterByCategoryBrandAndPrice = async (req, res) => {
//   try {
//     const { idCategory, idthuonghieu, Price } = req.query;
//     const products = await filterService.getProductsByCategoryBrandAndPrice(
//       idCategory,
//       idthuonghieu,
//       Number(Price)
//     );
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

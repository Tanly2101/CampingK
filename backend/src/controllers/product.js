const productService = require("../services/product");

export const findAll = async (req, res) => {
  try {
    let data = await productService.findAll();
    res.json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const findAllByName = async (req, res) => {
  const { Title } = req.query;
  if (!Title) {
    return res.status(400).json({ error: "Tên sản phẩm là tham số bắt buộc." });
  }
  try {
    // Gọi hàm của productService để tìm kiếm sản phẩm theo tên
    const products = await productService.findAllByName(Title);
    res.json(products);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
  }
};
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
  }
};
export const getProductsByCategory = async (req, res) => {
  const { idCategory } = req.params;
  try {
    const products = await productService.getProductsByCategory(idCategory);
    if (!products) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json(products);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
  }
};
// filter & pagination

export const getProductsByPrice = async (req, res) => {
  const { Price } = req.query;

  // Validate Price
  if (!Price || isNaN(Number(Price))) {
    return res.status(400).json({ error: "Giá không hợp lệ" });
  }

  try {
    const products = await productService.getProductsByPrice(Number(Price));

    // Check if products is an array
    if (!Array.isArray(products)) {
      return res
        .status(500)
        .json({ error: "Có lỗi xảy ra khi truy xuất sản phẩm." });
    }

    if (!products) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json(products);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
  }
};
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const result = await productService.deleteProducts(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the product" });
  }
};
export const createProduct = async (req, res) => {
  const {
    Title,
    Description,
    Price,
    sold,
    thuonghieu,
    idCategory,
    gianhap,
    chitiet,
    nameCategoryPhu,
  } = req.body; // Nhận thêm trường Details từ req.body

  // Lấy danh sách tên tệp tin từ multer
  const Images = req.files ? req.files.map((file) => file.filename) : []; // Lưu ý sử dụng `req.files` để lấy danh sách tệp tin
  const loaisanpham = "new";

  try {
    const result = await productService.createProduct(
      Title,
      Images, // Truyền danh sách tên tệp tin vào hàm createProduct
      Description,
      Price,
      loaisanpham,
      sold,
      thuonghieu,
      idCategory,
      gianhap,
      chitiet,
      nameCategoryPhu // Truyền thêm Details vào hàm createProduct
    );
    res.status(201).json({ message: "Product added successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

export const ProductDetailIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const result = await productService.ProductsDetailId(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product hienthi successfully" });
  } catch (error) {
    console.error("Error hienthi product:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while hienthi the product" });
  }
};
// export const updateProduct = async (req, res) => {
//   console.log("Request Body:", req.body);
//   console.log("Uploaded File:", req.file);
//   const {
//     Title,
//     Description,
//     Price,
//     sold,
//     thuonghieu,
//     idCategory,
//     loaisanpham,
//     gianhap,
//   } = req.body;
//   const idSP = req.params.id; // Assuming product ID is passed as a route parameter

//   // Lấy tên tệp tin từ multer, nếu có
//   const Images = req.files ? req.files.map((file) => file.filename) : [];

//   try {
//     const result = await productService.updateProducts({
//       Title,
//       Images, // Pass image filename or null
//       Description,
//       Price,
//       loaisanpham, // Pass the loaisanpham value from the request body
//       sold,
//       thuonghieu,
//       idCategory,
//       idSP,
//       gianhap,
//     });

//     res.status(200).json({ message: "Product updated successfully", result });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating product", error: error.message });
//   }
// };
export const updateProduct = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const {
    Title,
    Description,
    Price,
    PriceSale, // Extract PriceSale from the request body
    sold,
    thuonghieu,
    idCategory,
    loaisanpham,
    gianhap,
    chitiet,
    nameCategoryPhu,
  } = req.body;

  const idSP = req.params.id; // Assuming product ID is passed as a route parameter

  // Lấy tên tệp tin từ multer, nếu có
  const Images = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const result = await productService.updateProducts({
      Title,
      Images, // Pass image filename or null
      Description,
      Price,
      PriceSale, // Pass PriceSale to the update service
      loaisanpham,
      sold,
      thuonghieu,
      idCategory,
      idSP,
      gianhap,
      chitiet,
      nameCategoryPhu,
    });

    res.status(200).json({ message: "Product updated successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

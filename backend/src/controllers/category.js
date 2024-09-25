const categoryService = require("../services/categoryService");

export const findAll = async (req, res) => {
  try {
    let data = await categoryService.findAll();
    res.json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const findcategory = async (req, res) => {
  try {
    let data = await categoryService.findcategory();
    res.json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const findCategoryPhuById = async (req, res) => {
  const { IdCategory } = req.params; // Lấy id từ params của request

  try {
    const categories = await categoryService.findcategoryPhuId(IdCategory); // Gọi hàm để lấy danh mục phụ theo id
    if (categories.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục phụ." });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy dữ liệu." });
  }
};

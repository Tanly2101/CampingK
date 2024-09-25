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

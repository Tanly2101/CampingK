const cartService = require("../services/cartService");

export const createCart = async (req, res, next) => {
  try {
    const { idkhachhang, tongtien } = req.body;

    // Input validation

    if (!idkhachhang || !tongtien) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await cartService.createCart(idkhachhang, tongtien);

    console.log("Cart created successfully:", result);
    res.status(200).json({
      message: "Cart created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in cartController", error);
    res.status(500).json({
      message: "Error creating cart",
      error: error.message,
    });
    next(error);
  }
};
export const findAllById = async (req, res) => {
  try {
    const idKhachHang = req.params.idKhachHang || req.body.idKhachHang;

    if (!idKhachHang) {
      return res
        .status(400)
        .json({ message: "ID khách hàng không được cung cấp" });
    }

    let data = await cartService.getCartById(idKhachHang);

    res.json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const deleteCartById = async (req, res) => {
  try {
    const { idCart } = req.params;

    if (!idCart) {
      return res
        .status(400)
        .json({ message: "ID của giỏ hàng không được cung cấp" });
    }

    const success = await cartService.deleteCartItem(idCart);

    if (success) {
      res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm trong giỏ hàng với ID đã cung cấp",
      });
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng" });
  }
};

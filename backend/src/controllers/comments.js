const commentsService = require("../services/comments");

// import * as commentsService from "../services/commentsService";

export const createCommentController = async (req, res, next) => {
  try {
    const {
      LastName,
      PhoneComments,
      ContentComments,
      idsanpham,
      SaoDanhGia,
      customerId,
    } = req.body; // Include SaoDanhGia

    // Check if any required fields are missing
    if (
      !LastName ||
      !PhoneComments ||
      !ContentComments ||
      !SaoDanhGia // Đảm bảo SaoDanhGia không phải là null hoặc một giá trị "falsy"
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Gọi createComments với tham số SaoDanhGia mới
    const result = await commentsService.createComments(
      LastName,
      PhoneComments,
      ContentComments,
      idsanpham,
      SaoDanhGia,
      customerId // Include customerId in the function call
    );

    // Nếu khách hàng được cung cấp, hãy kiểm tra xem đơn hàng đã được xác minh chưa (nhưng không chặn việc tạo bình luận)
    if (customerId) {
      const isVerified = await commentsService.checkOrderVerification(
        customerId,
        idsanpham
      );

      if (isVerified) {
        // Nếu sản phẩm đã được mua và đơn hàng đã được giao, hãy cập nhật cột Đã xác minh thành true
        await commentsService.updateVerifiedStatus(result.insertId);
      } else {
        console.log("Order not verified or not delivered.");
      }
    }

    return res.status(200).json({
      message: "Bình luận đã được tạo thành công.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating comment",
      error: error.message,
    });
    next(error);
  }
};

export const getCommentsByProductId = async (req, res) => {
  const { idsanpham } = req.params;
  try {
    const comments = await commentsService.getCommentsByProductId(idsanpham);
    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No Comments found for this product" });
    }
    return res.status(200).json(comments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const hideComment = async (req, res) => {
  const { commentId } = req.params; // Lấy ID bình luận từ URL

  try {
    const result = await commentsService.hideComment(commentId);
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Bình luận đã bị ẩn" });
    }
    return res.status(404).json({ message: "Không tìm thấy bình luận" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

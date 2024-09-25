const commentsService = require("../services/comments");

// import * as commentsService from "../services/commentsService";

export const createCommentController = async (req, res, next) => {
  try {
    const { LastName, PhoneComments, ContentComments, idsanpham, SaoDanhGia } =
      req.body; // Include SaoDanhGia

    // Check if any required fields are missing
    if (
      !LastName ||
      !PhoneComments ||
      !ContentComments ||
      SaoDanhGia === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Call the createComments service with the new SaoDanhGia parameter
    const result = await commentsService.createComments(
      LastName,
      PhoneComments,
      ContentComments,
      idsanpham,
      SaoDanhGia // Include SaoDanhGia in the function call
    );

    console.log("Comment created successfully:", result);
    res.status(200).json({
      message: "Comment created successfully",
      data: result,
    });
  } catch (error) {
    // Log detailed error information
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

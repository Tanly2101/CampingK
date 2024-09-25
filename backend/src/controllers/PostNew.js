const PostService = require("../services/PostNewService");

// import * as commentsService from "../services/commentsService";

export const createPostController = async (req, res, next) => {
  try {
    const { title, description, userID } = req.body;

    // Input validation (add actual validation logic if necessary)
    if (!title || !description || !userID) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await PostService.createPost(title, description, userID);

    console.log("Comment created successfully:", result);
    res.status(200).json({
      message: "Comment created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in createCommentController:", error);
    res.status(500).json({
      message: "Error creating Post",
      error: error.message,
    });
    next(error);
  }
};

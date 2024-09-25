const uploadService = require("../services/upload");

// export const uploadController = async (req, res, next) => {
//   try {
//     const { Images, ImgFile } = req.body;

//     // Input validation

//     if (!Images || !ImgFile) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const result = await uploadService.uploadService(Images, ImgFile);

//     console.log("Post created successfully:", result);
//     res.status(200).json({
//       message: "Post created successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error in createPostController:", error);
//     res.status(500).json({
//       message: "Error creating post",
//       error: error.message,
//     });
//     next(error);
//   }
// };
export const uploadController = async (req, res, next) => {
  try {
    const imagePath = await uploadService.uploadFileService(req, res);
    res.json({ path: imagePath });
  } catch (error) {
    console.error("Error during file upload:", error); // Log the error
    res.status(error.status || 500).json({ message: error.message });
  }
};
export const uploadExperienceController = async (req, res, next) => {
  try {
    const imagePath = await uploadService.uploadExperienceService(req, res);
    res.json({ path: imagePath });
  } catch (error) {
    console.error("Error during experience upload:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};
export const getAllImages = async (req, res) => {
  try {
    const images = await uploadService.getAll();
    if (!images) {
      return res.status(404).json({ message: "No images found" });
    }
    return res.status(200).json(images);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const updateDuyet = async (req, res) => {
  const id = parseInt(req.params.id); // Lấy ID từ tham số URL

  try {
    const result = await uploadService.updateDuyetById(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image approved successfully" });
  } catch (error) {
    console.error("Error approving image:", error.message);
    res.status(500).json({ error: "Failed to approve image" });
  }
};
// export const uploadBlogControllers = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded!" });
//     }

//     // Gọi service để xử lý các file
//     const secureUrls = await uploadService.uploadFiles(req.files);

//     // Trả về URL ảnh cho client
//     res.json(secureUrls);
//   } catch (error) {
//     console.error("Error during file upload:", error);
//     res.status(500).json({ error: "An error occurred during file upload." });
//   }
// };
// export const uploadBlogControllers = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded!" });
//     }

//     // Lấy tiêu đề và nội dung từ req.body
//     const titleBlog = req.body.titleBlog;
//     const contentBlog = req.body.contentBlog;

//     // Kiểm tra các tham số
//     if (!titleBlog || !contentBlog) {
//       return res.status(400).json({ error: "Title and content are required!" });
//     }

//     // Chuyển đổi req.files để phù hợp với yêu cầu của uploadFiles
//     const filesWithTitle = req.files.map((file) => ({
//       path: file.path, // Đường dẫn URL đầy đủ của file
//       public_id: file.filename, // public_id có thể là filename hoặc thuộc tính khác
//       titleBlog: titleBlog, // Tiêu đề cho toàn bộ bài blog
//       contentBlog: contentBlog, // Nội dung cho toàn bộ bài blog
//     }));

//     // Gọi service để xử lý các file
//     const secureUrls = await uploadService.uploadFiles(filesWithTitle);

//     // Trả về URL ảnh cho client
//     res.json(secureUrls);
//   } catch (error) {
//     console.error("Error during file upload:", error);
//     res.status(500).json({ error: "An error occurred during file upload." });
//   }
// };
export const uploadBlogControllers = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded!" });
    }

    // Lấy tiêu đề và nội dung từ req.body
    const titleBlog = req.body.titleBlog || null;
    const contentBlog = req.body.contentBlog || null;

    // Kiểm tra các tham số
    if (!titleBlog || !contentBlog) {
      return res.status(400).json({ error: "Title and content are required!" });
    }

    // Chuyển đổi req.files để phù hợp với yêu cầu của uploadFiles
    const filesWithTitle = req.files.map((file) => ({
      path: file.path,
      public_id: file.filename,
    }));

    // Gọi service để xử lý các file và lưu bài blog
    const secureUrls = await uploadService.uploadFiles(
      filesWithTitle,
      titleBlog,
      contentBlog
    );

    // Trả về URL ảnh và blog_id cho client
    res.json({
      blogId: secureUrls[0].blog_id,
      images: secureUrls,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "An error occurred during file upload." });
  }
};

export const deleteImage = async (req, res) => {
  const { publicId } = req.params;

  // Kiểm tra xem publicId có được cung cấp hay không
  if (!publicId) {
    return res.status(400).json({ message: "Thiếu tham số publicId" });
  }

  try {
    // Gọi dịch vụ của bạn để xóa ảnh từ Cloudinary
    const result = await uploadService.deleteImageFromCloudinary(publicId);

    if (result.result === "ok") {
      return res.status(200).json({ message: "Xóa ảnh thành công" });
    } else {
      return res
        .status(400)
        .json({ message: "Xóa ảnh không thành công", result });
    }
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error);
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi xóa ảnh", error });
  }
};
// Hàm hỗ trợ để chia các phần tử thành nhóm (batch)
export const deleteBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    await uploadService.deleteBlogFromDatabase(blogId);
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteBlogImages = async (req, res) => {
  const blogId = req.params.id;

  try {
    const publicIds = await uploadService.getImagePublicIds(blogId);

    for (const publicId of publicIds) {
      await uploadService.deleteImageFromCloudinary(publicId);
    }

    await uploadService.deleteImagesFromDatabase(blogId);
    return res
      .status(200)
      .json({ message: "Blog images deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBlogImages:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
export const getAllData = async (req, res) => {
  try {
    const blogs = await uploadService.getBlogs();
    const blogImages = await uploadService.getBlogImages();

    res.status(200).json({ blogs, blogImages });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const con = require("../Config/connectDatabase");

const cloudinary = require("cloudinary").v2; // Update this path as needed
// Update this path as needed

// Update this path as needed
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Hàm để đảm bảo thư mục uploads tồn tại
const ensureUploadsDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Cấu hình lưu trữ của Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = path.join(__dirname, "../uploads"); // Đảm bảo đường dẫn nhất quán
//     ensureUploadsDir(dir);
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     const fileName = Date.now() + "-" + file.originalname; // Thêm dấu thời gian để tránh ghi đè tệp
//     cb(null, fileName);
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Xác định thư mục dựa trên tên trường của file
    let subDir = "";
    if (file.fieldname === "myfile") {
      subDir = "avatar";
    } else if (file.fieldname === "mydata") {
      subDir = "experience";
    } else {
      return cb(new Error("Invalid field name"), null);
    }

    // Đường dẫn đầy đủ tới thư mục lưu trữ
    const dir = path.join(__dirname, "../uploads", subDir);
    ensureUploadsDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname; // Thêm dấu thời gian để tránh ghi đè tệp
    cb(null, fileName);
  },
});

// Cài đặt Multer upload
const upload = multer({ storage: storage }).single("myfile");

export const uploadFileService = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, async function (err) {
      if (err) {
        console.error("Upload error:", err);
        return reject({ status: 500, message: err.message });
      }

      const file = req.file;
      if (!file) {
        console.error("No file selected");
        return reject({ status: 400, message: "Bạn chưa chọn file!" });
      }

      const { userId } = req.body;
      if (!userId) {
        console.error("userId is missing");
        return reject({
          status: 400,
          message: "Vui lòng điền đầy đủ thông tin",
        });
      }

      const imagePath = `/uploads/avatar/${file.filename}`;

      // SQL query to update user's avatar in the `khachhangs` table
      const sql = "UPDATE khachhangs SET anhdaidien = ? WHERE id = ?";
      try {
        const connection = await con.getConnection();
        await connection.execute(sql, [imagePath, userId]);
        connection.release(); // Release the connection back to the pool
        resolve({ message: "Avatar updated successfully", imagePath });
      } catch (error) {
        console.error("Database error:", error);
        reject({ status: 500, message: "Database update failed" });
      }
    });
  });
};

const uploadExperience = multer({ storage: storage }).single("mydata");

export const uploadExperienceService = (req, res) => {
  return new Promise((resolve, reject) => {
    uploadExperience(req, res, async function (err) {
      if (err) {
        console.error("Upload error:", err);
        return reject({ status: 500, message: err.message });
      }

      const { name, email } = req.body;

      if (!name || !email) {
        console.error("Name or email is missing");
        return reject({
          status: 400,
          message: "Vui lòng điền đầy đủ thông tin",
        });
      }

      const experienceFile = req.file;

      if (!experienceFile) {
        console.error("No file selected");
        return reject({
          status: 400,
          message: "Vui lòng chọn ảnh trải nghiệm",
        });
      }

      const Images_path = `/uploads/experience/${experienceFile.filename}`;

      // Lưu đường dẫn ảnh trải nghiệm vào cơ sở dữ liệu
      const sql = `
        INSERT INTO imgdangtin (Images_path, name, email, duyet, createdAt)
        VALUES (?, ?, ?,'chuaduyet', NOW())
      `;

      try {
        const connection = await con.getConnection();
        await connection.execute(sql, [Images_path, name, email]);
        connection.release(); // Release the connection back to the pool
        resolve(Images_path);
      } catch (error) {
        console.error("Database error:", error);
        reject({ status: 500, message: "Database insertion failed" });
      }
    });
  });
};
export const getAll = async () => {
  const connection = await con.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM imgdangtin");
    return rows; // Trả về tất cả các bản ghi
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
export const updateDuyetById = async (id) => {
  try {
    const [result] = await con.query(
      `UPDATE imgdangtin
        SET duyet = 'DaDuyet'
        WHERE idImg = ?;`,
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error updating role in database");
  }
};
// export const uploadFiles = async (files) => {
//   try {
//     const uploadPromises = files.map(async (file) => {
//       // File đã được upload tự động vào Cloudinary bởi multer và CloudinaryStorage
//       // Lấy URL và public_id từ object file
//       const { path, public_id } = file; // path: URL đầy đủ, filename: public_id với 'blog/'

//       // Nếu 'filename' có chứa 'blog/', loại bỏ phần 'blog/'
//       // const purePublicId = filename1.replace(/^blog\//, "");

//       return {
//         secure_url: path, // URL ảnh từ Cloudinary
//         public_id: public_id, // public_id không có 'blog/' trong tên
//       };
//     });

//     // Chờ tất cả các promises hoàn tất
//     const results = await Promise.all(uploadPromises);

//     return results;
//   } catch (error) {
//     throw new Error("Error during file upload: " + error.message);
//   }
// };

// export const uploadFiles = async (files) => {
//   try {
//     // Tạo một mảng các Promise cho từng tệp
//     const uploadPromises = files.map(async (file) => {
//       // Lấy URL, public_id và title từ object file
//       const { path, public_id, titleBlog, contentBlog } = file; // path: URL đầy đủ, public_id: mã công khai của file, titleBlog: tiêu đề của tệp, contentBlog: nội dung của tệp
//       console.log("File data:", { path, public_id, titleBlog, contentBlog });
//       // Thêm dữ liệu vào MySQL
//       const insertQuery = `
//         INSERT INTO uploaded_files (secure_url, public_id, titleBlog, contentBlog, uploaded_at)
//         VALUES (?, ?, ?, ?, NOW());
//       `;
//       const [result] = await con.execute(insertQuery, [
//         path,
//         public_id,
//         titleBlog,
//         contentBlog,
//       ]);

//       // Trả về thông tin đã thêm thành công
//       return {
//         secure_url: path, // URL ảnh từ Cloudinary
//         public_id: public_id, // public_id không có 'blog/' trong tên
//         titleBlog: titleBlog, // Tiêu đề của tệp
//         contentBlog: contentBlog, // Nội dung của tệp
//         dbInsertId: result.insertId, // ID của bản ghi vừa được thêm vào MySQL
//       };
//     });

//     // Chờ tất cả các promises hoàn tất
//     const results = await Promise.all(uploadPromises);

//     return results;
//   } catch (error) {
//     throw new Error("Error during file upload: " + error.message);
//   }
// };
export const uploadFiles = async (files, titleBlog, contentBlog) => {
  try {
    // Bắt đầu giao dịch

    // Thêm bài blog vào bảng `blogs`
    const blogInsertQuery = `
      INSERT INTO blogs (title, content, created_at)
      VALUES (?, ?, NOW());
    `;
    const [blogResult] = await con.execute(blogInsertQuery, [
      titleBlog,
      contentBlog,
    ]);
    const blogId = blogResult.insertId;

    // Tạo một mảng các Promise cho từng tệp
    const uploadPromises = files.map(async (file) => {
      const path = file.path || null;
      const public_id = file.public_id || null;

      // Kiểm tra dữ liệu đầu vào
      if (path === undefined || public_id === undefined) {
        throw new Error("Some required fields are missing");
      }

      // Thêm ảnh vào bảng `blog_images`
      const imageInsertQuery = `
        INSERT INTO blog_images (blog_id, secure_url, public_id, uploaded_at)
        VALUES (?, ?, ?, NOW());
      `;
      await con.execute(imageInsertQuery, [blogId, path, public_id]);

      return {
        secure_url: path,
        public_id: public_id,
        blog_id: blogId,
      };
    });

    // Chờ tất cả các promises hoàn tất
    const results = await Promise.all(uploadPromises);

    // Commit giao dịch

    return results;
  } catch (error) {
    // Rollback giao dịch nếu có lỗi
    throw new Error("Error during file upload: " + error.message);
  }
};
export const deleteImageFromCloudinary = async (publicId) => {
  console.log("Attempting to delete image with publicId:", publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result); // In kết quả để kiểm tra
    return result;
  } catch (error) {
    console.error("Error in deleteImageFromCloudinary:", error);
    throw new Error("Cloudinary image deletion failed");
  }
};
export const getImagePublicIds = async (blogId) => {
  try {
    const query = "SELECT public_id FROM blog_images WHERE blog_id = ?";
    const [results] = await con.execute(query, [blogId]); // Sử dụng execute để thực thi query
    return results.map((row) => row.public_id); // Trả về mảng chứa các public_id
  } catch (err) {
    throw new Error(err); // Ném lỗi nếu có vấn đề
  }
};
export const deleteImagesFromDatabase = async (blogId) => {
  try {
    const query = "DELETE FROM blog_images WHERE blog_id = ?";
    const [result] = await con.execute(query, [blogId]); // Sử dụng execute để thực thi câu query
    return result; // Trả về kết quả sau khi query thành công
  } catch (err) {
    throw new Error(err); // Ném lỗi nếu có vấn đề
  }
};
export const deleteBlogFromDatabase = async (blogId) => {
  try {
    const query = "DELETE FROM blogs WHERE id = ?";
    const [result] = await con.execute(query, [blogId]); // sử dụng execute để thực thi câu query với tham số
    return result; // trả về kết quả sau khi query thành công
  } catch (err) {
    throw new Error(err); // ném ra lỗi nếu có vấn đề xảy ra
  }
};
export const getBlogs = async () => {
  const [rows] = await con.query("SELECT * FROM blogs");
  return rows;
};
export const getBlogImages = async () => {
  const [rows] = await con.query("SELECT * FROM blog_images");
  return rows;
};
// Dịch vụ để xử lý tải tệp
// export const uploadFileService = (req, res) => {
//   return new Promise((resolve, reject) => {
//     upload(req, res, function (err) {
//       if (err) {
//         console.error("Upload error:", err); // Ghi log lỗi
//         return reject({ status: 500, message: err.message });
//       }

//       const file = req.file;
//       if (!file) {
//         console.error("No file selected"); // Ghi log lỗi
//         return reject({ status: 400, message: "Can chon file!" });
//       }

//       // Giải quyết Promise với đường dẫn tệp
//       resolve(file.path);
//     });
//   });
// };

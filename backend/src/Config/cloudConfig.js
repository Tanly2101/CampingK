const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "ddnfhpg98",
  api_key: "392452761677958",
  api_secret: "0NE7WQ2dTxgT1w-SuCyB0MeRQWE", // được cung cấp
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog",
    allowedFormats: ["jpg", "png"],
    public_id: (req, file) => {
      // Chỉ sử dụng thời gian hiện tại làm public_id
      return `${Date.now()}`;
    },
  },
});

const storageUserUploads = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_uploads", // Tải ảnh lên thư mục 'user_uploads'
    allowedFormats: ["jpg", "png"],
    public_id: (req, file) => {
      return `${Date.now()}`; // Tạo public_id dựa trên thời gian và tên file
    },
  },
});
const storageAvatarUploads = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_avatar", // Tải ảnh lên thư mục 'user_uploads'
    allowedFormats: ["jpg", "png"],
    public_id: (req, file) => {
      return `${Date.now()}`; // Tạo public_id dựa trên thời gian và tên file
    },
  },
});

const uploadCloud = multer({ storage });

const uploadToUserUploads = multer({ storage: storageUserUploads });

const uploadToAvatarUploads = multer({ storage: storageAvatarUploads });

module.exports = {
  uploadCloud,
  uploadToUserUploads,
  uploadToAvatarUploads,
};

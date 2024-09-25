const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "ddnfhpg98",
  api_key: "392452761677958",
  api_secret: "0NE7WQ2dTxgT1w-SuCyB0MeRQWE", // Click 'View API Keys' above to copy your API secret
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

const uploadCloud = multer({ storage });

module.exports = uploadCloud;

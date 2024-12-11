import express from "express";
import * as uploadNew from "../controllers/upload";
const { uploadCloud } = require("../Config/cloudConfig");
const { uploadToUserUploads } = require("../Config/cloudConfig");
const { uploadToAvatarUploads } = require("../Config/cloudConfig");

const router = express.Router();

router.post(
  "/uploadfile",
  uploadToAvatarUploads.single("myfile"),
  uploadNew.uploadController
);
router.post(
  "/upload-experience",
  uploadToUserUploads.single("mydata"),
  uploadNew.uploadExperienceController
); ///
router.get("/images", uploadNew.getAllImages);
router.patch("/updateDuyet/:id", uploadNew.updateDuyet);
router.delete("/delete-tin-dang/:id", uploadNew.deleteTinDang);
router.post(
  "/upload",
  uploadCloud.array("images", 10),
  uploadNew.uploadBlogControllers
);
router.delete("/blog/:id", uploadNew.deleteBlog);
router.delete("/blog/:id/images", uploadNew.deleteBlogImages);
router.get("/datablogs", uploadNew.getAllData);
module.exports = router;

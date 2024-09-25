import express from "express";
import * as uploadNew from "../controllers/upload";
const uploadCloud = require("../Config/cloudConfig");

const router = express.Router();

router.post("/uploadfile", uploadNew.uploadController);
router.post("/upload-experience", uploadNew.uploadExperienceController); ///
router.get("/images", uploadNew.getAllImages);
router.patch("/updateDuyet/:id", uploadNew.updateDuyet);

router.post(
  "/upload",
  uploadCloud.array("images", 10),
  uploadNew.uploadBlogControllers
);
router.delete("/blog/:id", uploadNew.deleteBlog);
router.delete("/blog/:id/images", uploadNew.deleteBlogImages);
router.get("/datablogs", uploadNew.getAllData);
module.exports = router;

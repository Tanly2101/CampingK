import express from "express";
import * as PostNew from "../controllers/PostNew";

const router = express.Router();

router.post("/postnew", PostNew.createPostController);

module.exports = router;

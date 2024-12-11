import express from "express";
import * as comments from "../controllers/comments";

const router = express.Router();

router.post("/comments", comments.createCommentController);
router.get("/commentsAll/:idsanpham", comments.getCommentsByProductId);
router.patch("/hide/:commentId", comments.hideComment);
module.exports = router;

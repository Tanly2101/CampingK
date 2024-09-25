import express from "express";
const category = require("../controllers/category");

const router = express.Router();

router.get("/category", category.findAll);
router.get("/categorySubList", category.findcategory);
router.get("/categorySubList/:IdCategory", category.findCategoryPhuById);

module.exports = router;

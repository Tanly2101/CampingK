import express from "express";
import * as product from "../controllers/product";

const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./src/uploads/avatarProducts/" });

router.get("/", product.findAll);
router.get("/search", product.findAllByName);
router.get("/price", product.getProductsByPrice);
router.get("/:id", product.getProductById);

router.get("/products/:idCategory", product.getProductsByCategory);
// router.delete("/:id", product.deleteProductController);
router.patch("/newstatus/:id", product.toggleProductStatusController);
router.post("/", upload.array("Images[]"), product.createProduct);
router.post("/recentlyViewedaxem", product.addProductDaxem);
router.get("/ganday/recentlyViewed", product.getProductsDaxem);
router.post("/:id", product.ProductDetailIdController);
// router.post("/", upload.single("Images"), product.createProduct);
router.put("/update/:id", upload.array("updateImages"), product.updateProduct);

module.exports = router;

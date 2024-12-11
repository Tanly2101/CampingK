import express from "express";
import * as filter from "../controllers/filter";

const router = express.Router();

router.get("/", filter.findAllByBrand);
router.get("/thuonghieu/:idthuonghieu", filter.findProductByBrand);
router.get("/categorySubListName/:NameCategory", filter.findCategoryPhuByName);
router.get("/filters", filter.getFilteredProducts);
// router.get("/brand-price", filter.filterByBrandAndPrice);
// router.get("/category-brand-price", filter.filterByCategoryBrandAndPrice);
module.exports = router;

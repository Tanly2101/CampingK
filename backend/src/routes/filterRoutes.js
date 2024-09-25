import express from "express";
import * as filter from "../controllers/filter";

const router = express.Router();

router.get("/", filter.findAllByBrand);
router.get("/thuonghieu/:idthuonghieu", filter.findProductByBrand);

module.exports = router;

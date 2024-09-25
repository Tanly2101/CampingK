import express from "express";
import * as saleController from "../controllers/Sale";

const router = express.Router();

router.get("/salesrecords", saleController.fetchAllSaleRecords);
router.post("/refreshsaleproducts", saleController.refreshSaleProducts);

module.exports = router;

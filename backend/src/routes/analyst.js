import express from "express";
import * as analystController from "../controllers/analyst";

const router = express.Router();

router.get("/totalsale", analystController.findTotalOrderSale);
router.get("/TotalOrders", analystController.findTotalOrder);
router.get("/RevenueMonth", analystController.findRevenueMonth);
router.get("/AllRevenue", analystController.findAllRevenue);
router.get("/Revenue/:startDate/:endDate", analystController.getDailyRevenue);
module.exports = router;

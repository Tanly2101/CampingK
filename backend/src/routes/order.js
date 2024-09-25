import express from "express";
import * as order from "../controllers/order";

const router = express.Router();

router.post("/create", order.createOrderController);
router.post("/detail", order.createOrderDetailController);
router.get("/productdt/:id", order.findAllByCustomerId);
router.get("/findall", order.findAll);
router.get("/findall/:customerId", order.getOrdersByCustomerId);
router.post("/cancelOrder/:id", order.cancelOrderController);
router.put("/update/", order.updateOrder);
// router.post("/Delete", order);

module.exports = router;

import express from "express";
import * as cartController from "../controllers/cart";

const router = express.Router();

router.post("/", cartController.createCart);
router.post("/cartProducts", cartController.findAllById);
router.delete("/:idCart", cartController.deleteCartById);

module.exports = router;

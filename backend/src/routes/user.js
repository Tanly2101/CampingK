import express from "express";
import * as user from "../controllers/user";

const router = express.Router();

router.post("/user", user.checkAccount);
router.post("/register", user.createAccount);
router.get("/user/avatar/:id", user.getAvatar);
router.get("/user/", user.getAll);
router.patch("/user/updateRole/:id", user.updateRole);
router.post("/change-password", user.changePassword);
module.exports = router;

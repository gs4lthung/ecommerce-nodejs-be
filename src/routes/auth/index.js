const express = require("express");
const authController = require("../../controllers/auth.controller");
const { catchAsyncHandle } = require("../../middlewares/error.middleware");

const router = express.Router();

router.post("/auth/shop/signup", catchAsyncHandle(authController.signUp));

router.post("/auth/shop/login", catchAsyncHandle(authController.login));

module.exports = router;

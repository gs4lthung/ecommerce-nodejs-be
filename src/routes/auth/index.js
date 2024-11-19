const express = require("express");
const authController = require("../../controllers/auth.controller");
const { catchAsyncHandle } = require("../../middlewares/error.middleware");

const router = express.Router();

router.post(
  "/shop/signup",
  catchAsyncHandle(authController.signUp)
);

module.exports = router;

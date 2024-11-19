const express = require("express");
const {
  checkApiKey,
  checkPermission,
} = require("../middlewares/auth.middleware");

const router = express.Router();
const authRoutes = require("./auth/index");

// check apiKey
router.use(checkApiKey);

// check permission
router.use(checkPermission("0000"));

router.use("/v1/api", authRoutes);

module.exports = router;

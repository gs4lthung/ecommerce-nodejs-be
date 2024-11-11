const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Ecommerce API",
  });
});

router.use("/v1/api", require("./auth"));

module.exports = router;

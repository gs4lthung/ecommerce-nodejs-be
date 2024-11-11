const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

require("./database/init.mongodb");
checkOverload();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Ecommerce API",
  });
});
module.exports = app;

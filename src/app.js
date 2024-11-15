const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
require("dotenv").config();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init database
require("./database/init.database");
checkOverload();

// init routes
app.use("/", require("./routes/index"));

module.exports = app;

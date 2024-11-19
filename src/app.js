const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
const {
  checkNotFoundError,
} = require("./middlewares/error.middleware");
const { handleErrorResponse } = require("./utils/response");
const { handleApiRequest } = require("./middlewares/request.middleware");
require("dotenv").config();

// init middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init database
require("./database/init.database");
checkOverload();

// request handler
app.use(handleApiRequest);

// init routes
app.use("/", require("./routes/index"));

// error handler
app.use(checkNotFoundError);
app.use(handleErrorResponse);

module.exports = app;

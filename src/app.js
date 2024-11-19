const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
const { checkNotFoundError } = require("./middlewares/error.middleware");
const { handleErrorResponse } = require("./utils/response");
const { handleApiRequest } = require("./middlewares/request.middleware");
const rateLimiter = require("./utils/rateLimiter");
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
require("dotenv").config();

// set default timezone
process.env.TZ = "Asia/Ho_Chi_Minh";

// init session
app.use(
  session({
    cookie: { maxAge: process.env.SESSION_EXPIRES_IN }, // 1 day
    store: new MemoryStore({
      checkPeriod: process.env.SESSION_EXPIRES_IN, // prune expired entries every 24h
    }),
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
  })
);

// init middlewares
app.use(helmet()); // secure app by setting various HTTP headers
app.use(compression()); // compress all responses
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use("/", express.static(__dirname)); // serve static files
app.disable("x-powered-by"); // disable x-powered-by header
app.set("trust proxy", 1); // trust first proxy
app.use(
  rateLimiter(process.env.RATE_LIMITER_TIME, process.env.RATE_LIMITER_REQUESTS)
); // rate limiter
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // enable cors

// init database
require("./database/init.database");
checkOverload();

// request logger
app.use(handleApiRequest);

// init routes
app.use("/", require("./routes"));

// error handler
app.use(checkNotFoundError);
app.use(handleErrorResponse);

module.exports = app;

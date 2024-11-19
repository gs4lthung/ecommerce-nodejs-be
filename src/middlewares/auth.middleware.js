const chalk = require("chalk");
const { findByKey } = require("../services/apikey.service");
const getLogger = require("../utils/logger");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objKey = await findByKey(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.apiKey = objKey;

    return next();
  } catch (error) {}
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    const logger = getLogger("CHECK_PERMISSION");
    if (!req.apiKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    logger.info(`Permission: ${chalk.yellow(req.apiKey.permissions)}`);
    const validPermission = req.apiKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    next();
  };
};
module.exports = { checkApiKey, checkPermission };

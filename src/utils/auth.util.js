const jwt = require("jsonwebtoken");
const getLogger = require("./logger");
const chalk = require("chalk");
const logger = getLogger("AUTH_UTIL");
require("dotenv").config();

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err)
        logger.error(chalk.blueBright("Failed to create token pair:") + err);
      logger.info(
        chalk.blueBright("Create token pair successfully:") +
          JSON.stringify(decode)
      );
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = { createTokenPair };

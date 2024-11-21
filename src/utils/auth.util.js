const jwt = require("jsonwebtoken");
const getLogger = require("./logger");
const chalk = require("chalk");
const logger = getLogger("AUTH_UTIL");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) logger.error(chalk.red("Failed to create token pair:") + err);
      logger.info(
        chalk.greenBright("Create token pair successfully:") +
          JSON.stringify(decode)
      );
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = { createTokenPair };

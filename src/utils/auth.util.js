const jwt = require("jsonwebtoken");
const getLogger = require("./logger");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const logger = getLogger("CREATE_TOKEN_PAIR");
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) logger.error(err);
      else logger.info(decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = { createTokenPair };

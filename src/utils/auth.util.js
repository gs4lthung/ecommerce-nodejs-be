const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      expiresIn: "2 days",
      algorithm: "RS256",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
      algorithm: "RS256",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.log("error verify: " + err);
      else console.log("decode verify: " + decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = { createTokenPair };

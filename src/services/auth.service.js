const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../utils/auth.util");
const { getInfoData } = require("../utils/response");
const { BadRequestError } = require("../core/responses/error.response");
const getLogger = require("../utils/logger");
const chalk = require("chalk");
const logger = getLogger("AUTH_SERVICE");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  static signUp = async ({ name, email, password }) => {
    const shopHolder = await shopModel.findOne({ email }).lean();
    if (shopHolder) throw new BadRequestError("Shop already registered!");

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      logger.info(`Private key: ${chalk.yellow(privateKey)}`);
      logger.info(`Public key: ${chalk.yellow(publicKey)}`);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore)
        return {
          code: 500,
          message: "keyStore error",
          status: "error",
        };

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      logger.info(`Access & Refresh tokens: ${chalk.yellow(tokens)}`);

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AuthService;

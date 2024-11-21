const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../utils/auth.util");
const { getInfoData } = require("../utils/response");
const {
  BadRequestError,
  UnauthorizedRequestError,
  InternalServerError,
} = require("../core/responses/error.response");
const getLogger = require("../utils/logger");
const chalk = require("chalk");
const { findByEmail } = require("./shop.service");
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

      if (!keyStore) {
        throw new InternalServerError();
      }

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

  /***
   *  1. Check email in db
   *  2. Compare password
   *  3. Create access token and refresh token
   *  4. Generate key pair
   *  5. Get data response
   */
  static login = async ({ email, password, refreshToken }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new UnauthorizedRequestError("Authentication error!");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });
    if (!keyStore) {
      throw new InternalServerError();
    }

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
}

module.exports = AuthService;

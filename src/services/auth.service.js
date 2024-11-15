const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../utils/auth.util");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  static signUp = async ({ name, email, password }) => {
    try {
      const shopHolder = await shopModel.findOne({ email }).lean();
      if (shopHolder)
        return {
          code: 40001,
          message: `Shop with email ${email} already exists`,
          status: "error",
        };

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log(privateKey, publicKey);

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString)
          return {
            code: 500,
            message: "publicKeyString error",
            status: "error",
          };

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log("Create token pair:", tokens);

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        message: "Internal Server Error",
        status: "error",
      };
    }
  };
}

module.exports = AuthService;

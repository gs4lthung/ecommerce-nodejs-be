const chalk = require("chalk");
const keytokenModel = require("../models/keytoken.model");
const getLoggger = require("../utils/logger");
const logger = getLoggger("KEY_TOKEN_SERVICE");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      if (!userId) {
        logger.error(
          chalk.redBright("Failed to create key token:") +
            "User ID is required!"
        );
        return;
      }
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;

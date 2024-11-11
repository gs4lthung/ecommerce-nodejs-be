const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const shopHolder = await shopModel.findOne({ email }).lean();
      if (shopHolder)
        return {
          code: 40001,
          message: "Email already exists",
          status: "error",
        };

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if(newShop){
        
      }
    } catch (error) {
      return {
        code: 500,
        message: "Internal Server Error",
        status: "error",
      };
    }
  };
}

module.exports = AccessService;

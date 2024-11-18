const { CREATED } = require("../core/responses/success.response");
const AuthService = require("../services/auth.service");

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Shop Created!",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AuthController();

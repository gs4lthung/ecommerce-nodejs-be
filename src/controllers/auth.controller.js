const { CREATED, OK } = require("../core/responses/success.response");
const AuthService = require("../services/auth.service");

class AuthController {
  login = async (req, res, next) => {
    new OK({
      message: "Login Successful!",
      metadata: await AuthService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Shop Created!",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AuthController();

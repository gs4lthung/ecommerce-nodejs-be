class AuthController {
  signUp = async (req, res, next) => {
    try {
      console.log("[P]::signUp", req.body);
      res.status(200).json({
        code: 20001,
        metadata: {
          userId: 1,
        },
      });
    } catch (error) {}
  };
}
module.exports = new AuthController();

const jwt = require("jsonwebtoken");
const { responseJson } = require(".");

module.exports = {
  createToken: (data) =>
    jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }),

  verifyToken(req, res) {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return responseJson({
        res,
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    return jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return responseJson({
          res,
          statusCode: 401,
          message: "Verify error",
        });
      }

      return decoded;
    });
  },
};

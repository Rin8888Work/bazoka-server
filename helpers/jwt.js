const jwt = require("jsonwebtoken");
const { responseJson } = require(".");

module.exports = {
  createToken: (data) =>
    jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }),

  verifyToken(req, res, next) {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return responseJson({
        res,
        statusCode: 401,
        message: "Vui lòng cung cấp accessToken",
      });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return responseJson({
          res,
          statusCode: 401,
          message: "accessToken không hợp lệ",
        });
      }

      req.user = decoded;
      next();
    });
  },
};

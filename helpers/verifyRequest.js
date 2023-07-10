const { responseJson } = require(".");
const { API_AUTHORIZE_TYPE } = require("../config/api");
const { verifyToken } = require("./jwt");

const verifyRequest = (req, res, next, type) => {
  switch (type) {
    case API_AUTHORIZE_TYPE.PUBLIC:
      next();
      break;

    case API_AUTHORIZE_TYPE.AUTHORIZE:
      const decodedToken = verifyToken(req, res);
      if (decodedToken?._id) {
        req.user = decodedToken;
        next();
      }
      break;

    case API_AUTHORIZE_TYPE.ADMIN:
      const decodedAdminToken = verifyToken(req, res);
      if (decodedAdminToken?._id) {
        if (decodedAdminToken.role.code === "ADMIN") {
          req.user = decodedAdminToken;
          next();
        } else {
          return responseJson({
            res,
            statusCode: 403,
            message: "Không có quyền truy cập",
          });
        }
      }

      break;

    case API_AUTHORIZE_TYPE.INIT:
      const decodedInitToken = verifyToken(req, res);
      if (decodedInitToken?._id) {
        if (decodedInitToken.isInit) {
          req.user = decodedInitToken;
          next();
        } else {
          return responseJson({
            res,
            statusCode: 403,
            message: "Không có quyền truy cập",
          });
        }
      }
      break;
  }
};

module.exports = verifyRequest;

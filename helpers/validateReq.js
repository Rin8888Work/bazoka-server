const { responseJson } = require(".");

module.exports = {
  validateDynamicFields: (requiredFields) => {
    return (req, res, next) => {
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return responseJson({
          res,
          statusCode: 400,
          message: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`,
        });
      }

      next();
    };
  },
};

const { responseJson } = require(".");

module.exports = {
  validateDynamicFields: (requiredFields) => {
    return (req, res, next) => {
      console.log({ ok: "ok" });
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return responseJson({
          res,
          statusCode: 400,
          message: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`,
        });
      }

      // Kiểm tra định dạng email (sử dụng regex)
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (req.body.email && !emailRegex.test(req.body.email)) {
        return responseJson({
          res,
          statusCode: 400,
          message: "Định dạng email không hợp lệ",
        });
      }

      // Kiểm tra định dạng số điện thoại (sử dụng regex)
      const phoneRegex = /^\d{10,11}$/;
      if (req.body.phone && !phoneRegex.test(req.body.phone)) {
        return responseJson({
          res,
          statusCode: 400,
          message: "Định dạng số điện thoại không hợp lệ",
        });
      }

      next();
    };
  },
};

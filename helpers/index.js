const moment = require("moment");

module.exports = {
  responseJson: ({
    res,
    statusCode = 200,
    message = "Success",
    error = "",
    data = {},
  }) =>
    res.status(statusCode).json({
      data,
      statusCode,
      message,
      error,
    }),

  generateVerificationCode: () => {
    const codeLength = 6;
    let verificationCode = "";

    for (let i = 0; i < codeLength; i++) {
      const digit = Math.floor(Math.random() * 10);
      verificationCode += digit.toString();
    }
    const codeExpireTime = moment().add(10, "minutes");

    return { verificationCode, codeExpireTime };
  },
};

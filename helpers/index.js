const moment = require("moment");
const bcrypt = require("bcrypt");
const {
  SUCCESS,
  CREATED,
  NO_CONTENT,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNKNOWN_STATUS,
  UNAUTHORIZED,
} = require("../config/errorCode");
const { default: mongoose } = require("mongoose");

const responseJson = ({
  res,
  statusCode = 200,
  message = "Success",
  error = "",
  status = "",
  data = {},
}) => {
  if (!status) {
    switch (statusCode) {
      case 200:
        status = SUCCESS;
        break;
      case 201:
        status = CREATED;
        break;
      case 204:
        status = NO_CONTENT;
        break;
      case 400:
        status = BAD_REQUEST;
        break;
      case 401:
        status = UNAUTHORIZED;
        break;
      case 403:
        status = FORBIDDEN;
        break;
      case 404:
        status = NOT_FOUND;
        break;
      case 500:
        status = INTERNAL_SERVER_ERROR;
        break;
      default:
        status = UNKNOWN_STATUS;
        break;
    }
  }

  return res.status(statusCode).json({
    status,
    statusCode,
    message,
    error,
    data,
  });
};
const responseCatchError = ({ res, error }) => {
  console.log({ error });
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `${field} đã tồn tại trong hệ thống`;
    responseJson({
      res,
      statusCode: 400,
      message,
      error,
    });
  } else if (error?.kind === "ObjectId") {
    responseJson({
      res,
      statusCode: 404,
      message: `Không tìm thấy id ${error.stringValue} trong hệ thống`,
      error,
    });
  } else {
    responseJson({
      res,
      statusCode: 500,
      message: "Đã có lỗi xảy ra. Vui lòng thử lại",
      error,
    });
  }
};

const convertIdToObjectId = async (res, id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    return responseJson({
      res,
      statusCode: 400,
      message: "ID không hợp lệ",
    });
  }
};
module.exports = {
  convertIdToObjectId,
  getFieldsFromModel: (model, fields) => {
    const result = {};
    fields.forEach((field) => {
      if (model[field] !== undefined) {
        result[field] = model[field];
      }
    });
    return result;
  },
  createHash: async (value) => {
    const hash = await bcrypt.hash(value, 10);

    return hash;
  },
  compareHash: async (value, hash) => {
    const match = await bcrypt.compare(value, hash);
    return match;
  },
  responseJson,
  responseCatchError,

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

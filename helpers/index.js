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
const CryptoJS = require("crypto-js");
const { Hash } = require("../models/hashSchema");
const responseJson = ({
  res,
  statusCode = 200,
  message = "Success",
  error = "",
  status = "",
  data = {},
  errorCode,
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
    status: errorCode ? errorCode : status,
    statusCode,
    message,
    error,
    data: data || {},
  });
};
const responseCatchError = ({ res, error }) => {
  console.log({ error });
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `${field} "${error.keyValue[field]}" is existed on our system`;
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
      message: `Notfound id ${error.stringValue} on our system`,
      error,
    });
  } else if (error?.name === "ValidationError") {
    responseJson({
      res,
      statusCode: 400,
      message: error.message,
      error,
    });
  } else {
    responseJson({
      res,
      statusCode: 500,
      message: "Server error. Please try again.",
      error,
    });
  }
};

const convertIdToObjectId = (res, id) => {
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

function encrypt(text) {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.CRYPTO_SECRET);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipher(
    "aes-256-cbc",
    process.env.CRYPTO_SECRET
  );
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function encrypt(value) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    process.env.CRYPTO_SECRET
  ).toString();
  return ciphertext;
}

// Hàm giải mã
function decrypt(value) {
  const bytes = CryptoJS.AES.decrypt(value, process.env.CRYPTO_SECRET);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

const getTelegramEvent = async ({ event, callbackData = {} }) => {
  const actions = event?.actions;

  if (!actions) {
    return null;
  }

  const inlineKeyboard = await Promise.all(
    Object.keys(actions).map(async (k) => {
      const { text, code } = actions[k];
      const hash = new Hash({
        hash: encrypt({
          ...callbackData,
          event: event.code,
          action: code,
        }),
      });
      await hash.save();

      return [
        {
          text,
          callback_data: hash._id,
        },
      ];
    })
  );

  return {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  };
};

const getTelegramReplyEvent = async ({ event, callbackData = {} }) => {
  const actions = event?.actions;

  if (!actions) {
    return null;
  }

  const inlineKeyboard = await Promise.all(
    Object.keys(actions).map(async (k) => {
      const { text, code } = actions[k];
      const hash = new Hash({
        hash: encrypt({
          ...callbackData,
          event: event.code,
          action: code,
        }),
      });
      await hash.save();

      return [
        {
          text,
          callback_data: hash._id,
        },
      ];
    })
  );

  return {
    inline_keyboard: inlineKeyboard,
  };
};

module.exports = {
  getTelegramReplyEvent,
  encrypt,
  decrypt,
  getTelegramEvent,
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

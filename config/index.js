const signupRouter = require("../routes/auth/signup");
const loginRouter = require("../routes/auth/login");
const verifyRouter = require("../routes/auth/verify");
const resendCodeRouter = require("../routes/auth/resendCode");

const API_CONFIGS = [
  {
    prefix: "/account",
    items: [
      {
        path: "/signup",
        handle: signupRouter,
      },
      {
        path: "/signin",
        handle: loginRouter,
      },
      {
        path: "/verify",
        handle: verifyRouter,
      },
    ],
  },
  {
    prefix: "/email",
    items: [
      {
        path: "/resendCode",
        handle: resendCodeRouter,
      },
    ],
  },
];

module.exports = { API_CONFIGS };

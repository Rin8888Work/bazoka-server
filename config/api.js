// Auth api route
const signupRouter = require("../routes/account/signup");
const signinRouter = require("../routes/account/signin");
const verifyRouter = require("../routes/account/verify");
const sendCodeRouter = require("../routes/account/sendCode");
const updateAccountRouter = require("../routes/account/update");
const overviewAccountRouter = require("../routes/account/overview");
const updateOverviewAccountRouter = require("../routes/account/updateOverview");
const decreaseDownloadRouter = require("../routes/account/decreaseDownload");
const updateSettingAccountRouter = require("../routes/account/settings/update");
const getSettingAccountRouter = require("../routes/account/settings/get");

// Role api route
const createRoleRouter = require("../routes/admin/role/create");
const updateRoleRouter = require("../routes/admin/role/update");
const deleteRoleRouter = require("../routes/admin/role/delete");
const itemRoleRouter = require("../routes/admin/role/item");
const listRoleRouter = require("../routes/admin/role/list");

// Screen api route
const createScreenRouter = require("../routes/admin/screen/create");
const updateScreenRouter = require("../routes/admin/screen/update");
const deleteScreenRouter = require("../routes/admin/screen/delete");
const itemScreenRouter = require("../routes/admin/screen/item");
const listScreenRouter = require("../routes/admin/screen/list");
const listScreensForUserRouter = require("../routes/admin/screen/listForUser");

// License api route
const createLicenseRouter = require("../routes/admin/license/create");
const updateLicenseRouter = require("../routes/admin/license/update");
const deleteLicenseRouter = require("../routes/admin/license/delete");
const itemLicenseRouter = require("../routes/admin/license/item");
const listLicenseRouter = require("../routes/admin/license/list");
const userListLicenseRouter = require("../routes/admin/license/userLicenses");

const imageRouter = require("../routes/image/get");

// function api route
// const createFunctionRouter = require("../routes/admin/function/create");
// const updateFunctionRouter = require("../routes/admin/function/update");
// const deleteFunctionRouter = require("../routes/admin/function/delete");
// const itemFunctionRouter = require("../routes/admin/function/item");
// const listFunctionRouter = require("../routes/admin/function/list");

// Admin api route
const createDefaultDataRouter = require("../routes/admin/createDefaultData");
const applyScreenDefaultForAccountRouter = require("../routes/admin/applyScreenDefaultForAccount");

const refreshTokenRouter = require("../routes/token/refresh");

// affiliate api route
const listAffiliateRouter = require("../routes/affiliate/list");
const createAffiliateRouter = require("../routes/affiliate/create");
const updateAffiliateRouter = require("../routes/affiliate/update");

const itemWalletRouter = require("../routes/wallet/item");
const listTransactionRouter = require("../routes/transactions/list");
const createTransactionRouter = require("../routes/transactions/create");

const teleBotRouter = require("../routes/teleBot");
const createRequestPayoutRouter = require("../routes/requestPayout/create");

// API authorizeType
const API_AUTHORIZE_TYPE = {
  PUBLIC: "PUBLIC",
  AUTHORIZE: "AUTHORIZE",
  ADMIN: "ADMIN",
  INIT: "INIT",
};

const API_CONFIGS = [
  {
    prefix: "/request-payout",
    items: [
      {
        path: "/create",
        handle: createRequestPayoutRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  {
    prefix: "/tele-bot",
    items: [
      {
        path: "/",
        handle: teleBotRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
    ],
  },
  {
    prefix: "/wallet",
    items: [
      {
        path: "/item",
        handle: itemWalletRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  {
    prefix: "/transactions",
    items: [
      {
        path: "/create",
        handle: createTransactionRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/list",
        handle: listTransactionRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  {
    prefix: "/affiliate",
    items: [
      {
        path: "/list",
        handle: listAffiliateRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/create",
        handle: createAffiliateRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/update",
        handle: updateAffiliateRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  {
    prefix: "/image",
    items: [
      {
        path: "/get",
        handle: imageRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
    ],
  },
  {
    prefix: "/token",
    items: [
      {
        path: "/refresh",
        handle: refreshTokenRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
    ],
  },
  {
    prefix: "/account",
    items: [
      {
        path: "/signup",
        handle: signupRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
      {
        path: "/signin",
        handle: signinRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
      {
        path: "/verify",
        handle: verifyRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
      {
        path: "/update",
        handle: updateAccountRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/get-setting-account",
        handle: getSettingAccountRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/update-setting-account",
        handle: updateSettingAccountRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  {
    prefix: "/account-overview",
    items: [
      {
        path: "/get",
        handle: overviewAccountRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
      {
        path: "/update",
        handle: updateOverviewAccountRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
      {
        path: "/decrease-download",
        handle: decreaseDownloadRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
    ],
  },
  {
    prefix: "/email",
    items: [
      {
        path: "/sendCode",
        handle: sendCodeRouter,
        type: API_AUTHORIZE_TYPE.PUBLIC,
      },
    ],
  },
  {
    prefix: "/admin/role",
    items: [
      {
        path: "/create",
        handle: createRoleRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/update",
        handle: updateRoleRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/delete",
        handle: deleteRoleRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/item",
        handle: itemRoleRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/list",
        handle: listRoleRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
    ],
  },
  {
    prefix: "/admin/screen",
    items: [
      {
        path: "/create",
        handle: createScreenRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/update",
        handle: updateScreenRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/delete",
        handle: deleteScreenRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/item",
        handle: itemScreenRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/list",
        handle: listScreenRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/screens-for-user",
        handle: listScreensForUserRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  {
    prefix: "/admin/license",
    items: [
      {
        path: "/create",
        handle: createLicenseRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/update",
        handle: updateLicenseRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/delete",
        handle: deleteLicenseRouter,
        type: API_AUTHORIZE_TYPE.ADMIN,
      },
      {
        path: "/item",
        handle: itemLicenseRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/list",
        handle: listLicenseRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
      {
        path: "/user",
        handle: userListLicenseRouter,
        type: API_AUTHORIZE_TYPE.AUTHORIZE,
      },
    ],
  },
  // {
  //   prefix: "/function",
  //   items: [
  //     {
  //       path: "/create",
  //       handle: createFunctionRouter,
  //     },
  //     {
  //       path: "/update",
  //       handle: updateFunctionRouter,
  //     },
  //     {
  //       path: "/delete",
  //       handle: deleteFunctionRouter,
  //     },
  //     {
  //       path: "/item",
  //       handle: itemFunctionRouter,
  //     },
  //     {
  //       path: "/list",
  //       handle: listFunctionRouter,
  //     },
  //   ],
  // },
  {
    prefix: "/admin/initial",
    items: [
      {
        path: "/create-default-data",
        handle: createDefaultDataRouter,
        type: API_AUTHORIZE_TYPE.INIT,
      },
      {
        path: "/apply-default-screens-for-account",
        handle: applyScreenDefaultForAccountRouter,
        type: API_AUTHORIZE_TYPE.INIT,
      },
    ],
  },
];

module.exports = { API_CONFIGS, API_AUTHORIZE_TYPE };

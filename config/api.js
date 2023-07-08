// Auth api route
const signupRouter = require("../routes/account/signup");
const signinRouter = require("../routes/account/signin");
const verifyRouter = require("../routes/account/verify");
const sendCodeRouter = require("../routes/account/sendCode");
const updateAccountRouter = require("../routes/account/update");

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

// Package api route
const createPackageRouter = require("../routes/admin/package/create");
const updatePackageRouter = require("../routes/admin/package/update");
const deletePackageRouter = require("../routes/admin/package/delete");
const itemPackageRouter = require("../routes/admin/package/item");
const listPackageRouter = require("../routes/admin/package/list");

// function api route
// const createFunctionRouter = require("../routes/admin/function/create");
// const updateFunctionRouter = require("../routes/admin/function/update");
// const deleteFunctionRouter = require("../routes/admin/function/delete");
// const itemFunctionRouter = require("../routes/admin/function/item");
// const listFunctionRouter = require("../routes/admin/function/list");

// Admin api route
const createDefaultScreenRouter = require("../routes/admin/createDefaultScreen");
const applyScreenDefaultForAccountRouter = require("../routes/admin/applyScreenDefaultForAccount");

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
        handle: signinRouter,
      },
      {
        path: "/verify",
        handle: verifyRouter,
      },
      {
        path: "/update",
        handle: updateAccountRouter,
      },
    ],
  },
  {
    prefix: "/email",
    items: [
      {
        path: "/sendCode",
        handle: sendCodeRouter,
      },
    ],
  },
  {
    prefix: "/role",
    items: [
      {
        path: "/create",
        handle: createRoleRouter,
      },
      {
        path: "/update",
        handle: updateRoleRouter,
      },
      {
        path: "/delete",
        handle: deleteRoleRouter,
      },
      {
        path: "/item",
        handle: itemRoleRouter,
      },
      {
        path: "/list",
        handle: listRoleRouter,
      },
    ],
  },
  {
    prefix: "/screen",
    items: [
      {
        path: "/create",
        handle: createScreenRouter,
      },
      {
        path: "/update",
        handle: updateScreenRouter,
      },
      {
        path: "/delete",
        handle: deleteScreenRouter,
      },
      {
        path: "/item",
        handle: itemScreenRouter,
      },
      {
        path: "/list",
        handle: listScreenRouter,
      },
    ],
  },
  {
    prefix: "/package",
    items: [
      {
        path: "/create",
        handle: createPackageRouter,
      },
      {
        path: "/update",
        handle: updatePackageRouter,
      },
      {
        path: "/delete",
        handle: deletePackageRouter,
      },
      {
        path: "/item",
        handle: itemPackageRouter,
      },
      {
        path: "/list",
        handle: listPackageRouter,
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
    prefix: "/initial",
    items: [
      {
        path: "/create-default-screens",
        handle: createDefaultScreenRouter,
      },
      {
        path: "/apply-default-screens-for-account",
        handle: applyScreenDefaultForAccountRouter,
      },
    ],
  },
];

module.exports = { API_CONFIGS };

const express = require("express");
const { Screen } = require("../../models/ScreenSchema");
const { Role } = require("../../models/RoleSchema");
const { License } = require("../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { screensDefault } = require("../../config/screensDefault");
const { rolesDefault } = require("../../config/rolesDefault");
const { licensesDefault } = require("../../config/licensesDefault");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await Role.deleteMany({});
    await License.deleteMany({});
    await Screen.deleteMany({});

    const addRolesPromise = rolesDefault.map(({ name, code }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const role = new Role({ name, code });
          await role.save();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    const addLicensesPromise = licensesDefault.map(({ name, code }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const license = new License({ name, code });
          await license.save();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    await Promise.all(addRolesPromise);
    await Promise.all(addLicensesPromise);

    // Tạo các screens mới từ dữ liệu mặc định
    await createDefaultScreens(screensDefault);

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo data mặc định thành công",
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

async function createDefaultScreens(screens) {
  screens.forEach(async (screen) => {
    await createScreen(screen);
  });
}

async function createScreen(screenData, parent) {
  const {
    name,
    code,
    screenPath,
    description,
    children,
    roleAccess,
    licenseAccess,
    order,
  } = screenData;
  const roles = await Role.find({ code: { $in: roleAccess } });
  const licenses = await License.find({ code: { $in: licenseAccess } });

  const screen = new Screen({
    name,
    code,
    order,
    screenPath,
    description,
    parent,
    roleAccess: roles?.map((r) => r._id),
    licenseAccess: licenses?.map((p) => p._id),
  });

  await screen.save();

  if (children && children.length > 0) {
    children.forEach(async (childData) => {
      await createScreen(childData, screen._id);
    });
  }
}

module.exports = router;

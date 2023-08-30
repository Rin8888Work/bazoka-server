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

    const addLicensesPromise = licensesDefault.map((licenseItem) => {
      return new Promise(async (resolve, reject) => {
        try {
          const license = new License({ ...licenseItem });
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
  const createScreensPromise = screens.map(async (screen) => {
    return new Promise(async (resolve, reject) => {
      try {
        await createScreen(screen);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
  await Promise.all(createScreensPromise);
}

async function createScreen(screenData, parent) {
  const {
    name,
    code,
    screenPath,
    prefixPath,
    description,
    children,
    roleAccess,
    licenseAccess,
    order,
  } = screenData;
  try {
    const roles = await Role.find({ code: { $in: roleAccess } }).select("_id");
    const licenses = await License.find({
      code: { $in: licenseAccess },
    }).select("_id");

    const _roleAccess = roles?.map((r) => r._id);
    const _licenseAccess = licenses?.map((r) => r._id);

    const screen = new Screen({
      name,
      code,
      order,
      screenPath,
      prefixPath,
      description,
      parent,
      rolesAccess: _roleAccess,
      licensesAccess: _licenseAccess,
    });

    await screen.save();

    if (children && children.length > 0) {
      const createScreensPromise = children.map(async (childData) => {
        return new Promise(async (resolve, reject) => {
          try {
            await createScreen(childData, screen._id);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
      await Promise.all(createScreensPromise);
    }
  } catch (error) {
    console.log({ error });
  }
}

module.exports = router;

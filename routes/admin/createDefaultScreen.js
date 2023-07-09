const express = require("express");
const { Screen } = require("../../models/ScreenSchema");
const { Role } = require("../../models/RoleSchema");
const { License } = require("../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { screensDefault } = require("../../config/screensDefault");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Xóa toàn bộ screens hiện có trong database
    await Screen.deleteMany({});

    // Tạo các screens mới từ dữ liệu mặc định
    await createDefaultScreens(screensDefault);

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo screens mặc định thành công",
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

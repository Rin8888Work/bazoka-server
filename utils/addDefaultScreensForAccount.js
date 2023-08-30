const { User } = require("../models/UserSchema");
const { Screen } = require("../models/ScreenSchema");
const { responseJson } = require("../helpers");
const { screensDefault } = require("../config/screensDefault");
const { License } = require("../models/LicenseSchema");
const { Role } = require("../models/RoleSchema");
const { UserOverview } = require("../models/UserOverviewSchema");

function hasCommonElements(array1, array2) {
  return array1.some((element) => array2.includes(element));
}

// Tạo danh sách màn hình mặc định dựa trên roleAccess và licenseAccess
async function createDefaultScreens(screensDefault, role, license) {
  const defaultScreens = [];

  const mapScreensPromise = screensDefault.map(async (screen) => {
    // Kiểm tra roleAccess và licenseAccess của screen
    const screenObj = await Screen.findOne({ code: screen.code });
    const screenItem = {
      screen: screenObj._id,
      children: [],
    };

    // Kiểm tra các screen con
    if (screen.children && screen.children.length > 0) {
      const mapChildrenScreensPromise = screen.children.map(
        async (childScreen) => {
          const childScreenObj = await Screen.findOne({
            code: childScreen.code,
          });

          screenItem.children.push(childScreenObj._id);
        }
      );
      await Promise.all(mapChildrenScreensPromise);
    }

    if (
      screen.roleAccess.includes(role)
      // &&
      // hasCommonElements(screen.licenseAccess, license)
    ) {
      defaultScreens.push(screenItem);
    }
  });

  await Promise.all(mapScreensPromise);

  return defaultScreens;
}

module.exports = async ({ res, username, roleCode, licenseCode }) => {
  const licenses = licenseCode.split(",");

  if (!licenses.length)
    return responseJson({
      res,
      statusCode: 400,
      message: "licenseCode không hợp lệ",
    });

  // Tìm người dùng theo username hoặc email
  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) {
    return responseJson({
      res,
      statusCode: 404,
      message: "Người dùng không tồn tại",
    });
  }

  // Kiểm tra xem người dùng đã có màn hình mặc định chưa
  // if (user.screens && user.screens.length > 0) {
  //   return responseJson({
  //     res,
  //     statusCode: 200,
  //     message: "Người dùng đã có danh sách màn hình mặc định",
  //   });
  // }

  const _licenses = await License.find({ code: { $in: licenses } }).select(
    "_id code module frequency qty"
  );
  const roleObj = await Role.findOne({ code: roleCode }).select("_id code");

  // Tạo danh sách màn hình dựa trên roleAccess và licenseAccess
  const defaultScreens = await createDefaultScreens(
    screensDefault,
    roleObj.code
    // _licenses.map((i) => i.code)
  );

  const userOverview = await UserOverview.findOne({
    username,
  });

  if (!userOverview?.username) {
    let userOverviewData = {
      username: user.username,
    };

    _licenses.map(({ module: type, frequency, qty, code }) => {
      switch (type) {
        case "DOWNLOAD":
          userOverviewData.downloadQty = qty;
          userOverviewData.downloadCode = code;
          break;

        case "PROFILE":
          userOverviewData.profileQty = qty;
          userOverviewData.profileCode = code;

          if (frequency === "MONTHLY") {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + 30);
            userOverviewData.profileExpiry = newDate;
          }

          if (frequency === "YEARLY") {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + 365);
            userOverviewData.profileExpiry = newDate;
          }
          break;

        case "EDIT_VIDEO":
          userOverviewData.editVideoQty = qty;
          userOverviewData.editVideoCode = code;

          break;
      }
    });

    const newUserOverview = new UserOverview(userOverviewData);

    await newUserOverview.save();
  } else {
    _licenses.map(({ module: type, frequency, qty, code }) => {
      switch (type) {
        case "DOWNLOAD":
          userOverview.downloadCode = code;
          if (!code.includes("UNLIMITED"))
            userOverview.downloadQty === -1
              ? (userOverview.downloadQty += qty + 1)
              : (userOverview.downloadQty += qty);
          else userOverview.downloadQty = -1;
          userOverview.isDownloadTrial = false;
          userOverview.isDownloadPaid = true;
          break;

        case "PROFILE":
          userOverview.profileCode = code;
          userOverview.profileQty += qty;
          userOverview.isProfileTrial = false;
          userOverview.isProfilePaid = true;
          if (frequency === "MONTHLY") {
            let newDate = new Date();
            if (userOverview.profileExpiry)
              newDate = new Date(userOverview.profileExpiry);
            newDate.setDate(newDate.getDate() + 30);
            userOverview.profileExpiry = newDate;
          }

          if (frequency === "YEARLY") {
            let newDate = new Date();
            if (userOverview.profileExpiry)
              newDate = new Date(userOverview.profileExpiry);
            newDate.setDate(newDate.getDate() + 365);
            userOverview.profileExpiry = newDate;
          }
          break;

        case "EDIT_VIDEO":
          userOverview.editVideoCode = code;
          if (!code.includes("UNLIMITED"))
            userOverview.editVideoQty === -1
              ? (userOverview.editVideoQty += qty + 1)
              : (userOverview.editVideoQty += qty);
          else userOverview.editVideoQty = -1;
          userOverview.isEditVideoTrial = false;
          userOverview.isEditVideoPaid = true;
          break;
      }
    });

    await userOverview.save();
  }
  // Cập nhật danh sách màn hình cho người dùng
  user.screens = defaultScreens;
  user.role = roleObj._id;
  user.license = _licenses.map((i) => i._id);
  await user.save();

  const userResponse = await User.findOne({
    $or: [{ username }, { email: username }],
  })
    .populate({ path: "role" })
    .populate({ path: "license" })
    .populate({
      path: "screens",
      populate: [
        {
          path: "screen",
          select: "order name code description screenPath",
        },
        {
          path: "children",
          select: "order name code description screenPath",
        },
      ],
    });

  userResponse.screens.sort((a, b) => a.screen.order - b.screen.order);
  userResponse.screens.forEach((screen) => {
    screen.children.sort((a, b) => a.order - b.order);
  });

  return userResponse;
};

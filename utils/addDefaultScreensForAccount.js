const { User } = require("../models/UserSchema");
const { Screen } = require("../models/ScreenSchema");
const { responseJson } = require("../helpers");
const { screensDefault } = require("../config/screensDefault");

// Tạo danh sách màn hình mặc định dựa trên roleAccess và packageAccess
async function createDefaultScreens(screensDefault, role, package) {
  const defaultScreens = [];

  const mapScreensPromise = screensDefault.map(async (screen) => {
    // Kiểm tra roleAccess và packageAccess của screen
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
      screen.roleAccess.includes(role.toString()) &&
      screen.packageAccess.includes(package.toString())
    ) {
      defaultScreens.push(screenItem);
    }
  });

  await Promise.all(mapScreensPromise);

  return defaultScreens;
}

module.exports = async ({ res, username = "", email = "" }) => {
  // Tìm người dùng theo username hoặc email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  })
    .populate("role")
    .populate("package");

  if (!user) {
    return responseJson({
      res,
      statusCode: 404,
      message: "Người dùng không tồn tại",
    });
  }

  // Kiểm tra xem người dùng đã có màn hình mặc định chưa
  if (user.screens && user.screens.length > 0) {
    return responseJson({
      res,
      statusCode: 200,
      message: "Người dùng đã có danh sách màn hình mặc định",
    });
  }

  // Tạo danh sách màn hình dựa trên roleAccess và packageAccess
  const defaultScreens = await createDefaultScreens(
    screensDefault,
    user.role.code,
    user.package.code
  );

  // Cập nhật danh sách màn hình cho người dùng
  user.screens = defaultScreens;
  await user.save();

  const userResponse = await User.findOne({})
    .populate({ path: "role" })
    .populate({ path: "package" })
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

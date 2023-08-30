const express = require("express");
const { User } = require("../../models/UserSchema");
const { responseJson, getFieldsFromModel } = require("../../helpers");
const {
  createToken,
  verifyToken,
  createRefreshToken,
} = require("../../helpers/jwt"); // Import the helper functions for token handling
const { validateDynamicFields } = require("../../helpers/validateReq");

const router = express.Router();

router.post("/", validateDynamicFields(["refreshToken"]), async (req, res) => {
  try {
    const { refreshToken } = req.body;
    req.headers.authorization = refreshToken;

    // Verify the refresh token
    const decodedToken = verifyToken(req, res);
    if (!decodedToken || !decodedToken.userId) {
      return responseJson({
        res,
        statusCode: 401,
        message: "Invalid refresh token",
      });
    }

    // Find the user based on the user ID from the refresh token
    const user = await User.findById(decodedToken.userId)
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

    if (!user) {
      return responseJson({
        res,
        statusCode: 401,
        message: "User not found",
      });
    }

    // Create a new access token
    const accessToken = createToken(
      getFieldsFromModel(user, [
        "_id",
        "username",
        "email",
        "isVerify",
        "role",
        "license",
        "isInit",
        "refCode",
        "refUser",
      ])
    );

    // Create the refresh token
    const newRefreshToken = createRefreshToken({ userId: user._id });

    // Send the new access token to the client
    responseJson({
      res,
      statusCode: 200,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    console.log(error);
    responseJson({
      res,
      statusCode: 500,
      error,
      message: "An error occurred. Please try again.",
    });
  }
});

module.exports = router;

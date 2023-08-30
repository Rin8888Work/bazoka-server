// routes/account/update.js
const express = require("express");
const { UserOverview } = require("../../models/UserOverviewSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFields } = require("../../helpers/validateReq");
const { License } = require("../../models/LicenseSchema");

const router = express.Router();

router.put(
  "/",
  validateDynamicFields(["licensesCode", "username"]),
  async (req, res) => {
    try {
      const { username, licensesCode } = req.body;
      const _licensesCode = licensesCode.split(",");
      const userOverview = await UserOverview.findOne({ username });

      const licenses = await License.find({
        code: { $in: _licensesCode },
      }).select("_id code module frequency qty");

      licenses.map(({ module: type, frequency, qty, code }) => {
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

      responseJson({
        res,
        statusCode: 200,
        message: "Cập nhật thông tin thành công",
        data: { userOverview },
      });
    } catch (error) {
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

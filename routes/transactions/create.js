const express = require("express");
const { Transaction } = require("../../models/TransactionSchema");
const { Wallet } = require("../../models/WalletSchema");
const {
  responseJson,
  responseCatchError,
  getTelegramEvent,
} = require("../../helpers");
const { validateDynamicFields } = require("../../helpers/validateReq");
const { UserOverview } = require("../../models/UserOverviewSchema");
const { License } = require("../../models/LicenseSchema");
const router = express.Router();
const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_ACTIONS } = require("../../config/teleActions");

router.post(
  "/",
  validateDynamicFields(["transactionType", "amount", "information"]),
  async (req, res) => {
    try {
      const { username, refUser: refUserId } = req.user;
      const wallet = await Wallet.findOne({ username }).select("_id amount");
      if (!wallet._id)
        return responseJson({
          res,
          statusCode: 400,
          message: "Không tìm thấy ví của user",
        });

      const { transactionType, amount, information, licenseCode } = req.body;

      const transactionData = {
        username,
        walletId: wallet._id,
        transactionType,
        amount,
        information,
      };

      if (transactionType === "PAID_LICENSE") {
        if (wallet.amount < amount) {
          // Not enough amount on wallet
          return responseJson({
            res,
            statusCode: 400,
            message:
              "Bạn không có đủ số dư. Vui lòng nạp thêm tiền vào tài khoản.",
          });
        } else {
          const license = await License.findOne({
            code: licenseCode,
          }).select("_id code module frequency qty");
          if (!licenseCode || !license._id) {
            return responseJson({
              res,
              statusCode: 400,
              message: "Không tìm thấy gói bạn đăng kí trong hê thống",
            });
          }
          //  enough amount on wallet
          transactionData.transactionStatus = "SUCCESS";
          const userOverview = await UserOverview.findOne({ username });

          switch (license.module) {
            case "DOWNLOAD":
              userOverview.downloadCode = license.code;
              if (!license.code.includes("UNLIMITED"))
                userOverview.downloadQty === -1
                  ? (userOverview.downloadQty += license.qty + 1)
                  : (userOverview.downloadQty += license.qty);
              else userOverview.downloadQty = -1;
              userOverview.isDownloadTrial = false;
              userOverview.isDownloadPaid = true;
              break;

            case "PROFILE":
              userOverview.profileCode = license.code;
              userOverview.profileQty += license.qty;
              userOverview.isProfileTrial = false;
              userOverview.isProfilePaid = true;
              if (license.frequency === "MONTHLY") {
                let newDate = new Date();
                if (userOverview.profileExpiry)
                  newDate = new Date(userOverview.profileExpiry);
                newDate.setDate(newDate.getDate() + 30);
                userOverview.profileExpiry = newDate;
              }

              if (license.frequency === "YEARLY") {
                let newDate = new Date();
                if (userOverview.profileExpiry)
                  newDate = new Date(userOverview.profileExpiry);
                newDate.setDate(newDate.getDate() + 365);
                userOverview.profileExpiry = newDate;
              }
              break;

            case "EDIT_VIDEO":
              userOverview.editVideoCode = license.code;
              if (!license.code.includes("UNLIMITED"))
                userOverview.editVideoQty === -1
                  ? (userOverview.editVideoQty += license.qty + 1)
                  : (userOverview.editVideoQty += license.qty);
              else userOverview.editVideoQty = -1;
              userOverview.isEditVideoTrial = false;
              userOverview.isEditVideoPaid = true;
              break;
          }
          // Update wallet amount
          wallet.amount -= amount;
          await wallet.save();
          await userOverview.save();
          const data = new Transaction(transactionData);
          await data.save();

          return responseJson({
            res,
            statusCode: 200,
            message: "Đăng kí gói thành công",
          });
        }
      } else if (transactionType === "DEPOSIT") {
        transactionData.transactionStatus = "PENDING";

        const data = new Transaction(transactionData);

        await data.save();
        const bot = new TelegramBot(process.env.TELE_ACCESS_TOKEN, {
          polling: false,
        });

        try {
          const options = await getTelegramEvent({
            event: TELEGRAM_ACTIONS.DEPOSIT_MONEY,
            callbackData: {
              username,
              amount,
              transactionId: data._id,
              refUserId,
            },
          });

          await bot.sendMessage(
            process.env.TELE_CHAT_ID,
            `Hey Bazoka Admin, You have a new deposit from user:\n${username} | ${transactionType} | ${amount}| ${information}`,
            options
          );
        } catch (error) {
          console.log({ error });
          return responseJson({
            res,
            statusCode: 200,
            message:
              "Hệ thống nạp tự động đang gián đoạn. Vui lòng liên hệ admin để được cộng tiền. Cảm ơn bạn!",
            data: {
              transaction: data,
            },
          });
        }

        return responseJson({
          res,
          statusCode: 200,
          message:
            "Tạo lệnh nạp tiền thành công. Hệ thống sẽ kiểm tra và cộng tiền vào ví.",
          data: {
            transaction: data,
          },
        });
      }
    } catch (error) {
      console.log({ error });
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

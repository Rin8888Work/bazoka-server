const express = require("express");
const { RequestPayout } = require("../../models/RequestPayoutSchema");
const {
  responseJson,
  responseCatchError,
  getTelegramEvent,
} = require("../../helpers");
const router = express.Router();
const { UserAffiliate } = require("../../models/UserAffiliateSchema");
const { Wallet } = require("../../models/WalletSchema");
const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_ACTIONS } = require("../../config/teleActions");
const { UserSetting } = require("../../models/UserSettingSchema");

router.post("/", async (req, res) => {
  try {
    const { username } = req.user;
    const userSetting = await UserSetting.findOne({ username });
    if (
      !userSetting?._id ||
      !userSetting?.payoutAccountHolder ||
      !userSetting?.payoutAccountNumber ||
      !userSetting?.payoutMethod
    ) {
      return responseJson({
        res,
        statusCode: 400,
        message: "Bạn chưa cập nhật phương thức nhận thanh toán.",
      });
    }

    const wallet = await Wallet.findOne({ username }).select("affiliateAmount");

    if (wallet?.affiliateAmount < 200000) {
      return responseJson({
        res,
        statusCode: 400,
        message: "Bạn chỉ có thể yêu cầu khi số dư đạt ít nhất 200.000 VND",
      });
    }

    const availablePayout = await UserAffiliate.find({
      receivedUsername: username,
      tracking: "REF_CREATED",
    });
    const availableIds = availablePayout?.map((i) => i._id);

    await UserAffiliate.updateMany(
      { _id: { $in: availableIds } },
      { $set: { tracking: "REQUEST_WITHDRAW" } }
    );

    const money = availablePayout?.reduce(
      (accumulator, item) => accumulator + item.refMoney,
      0
    );

    wallet.affiliateAmount -= money;
    await wallet.save();

    const newData = {
      username,
      money,
      affiliateIds: availableIds,
    };

    const data = new RequestPayout(newData);
    await data.save();

    const bot = new TelegramBot(process.env.TELE_ACCESS_TOKEN, {
      polling: false,
    });

    const options = await getTelegramEvent({
      event: TELEGRAM_ACTIONS.REVIEW_AFFILIATE_PAYOUT,
      callbackData: {
        username,
        amount: money,
        affiliateIds: availableIds,
      },
    });

    const detail = availableIds?.map((i) => `- AFF_ID: ${i}\n`);
    const methodPayout = `Phương thức: ${userSetting.payoutMethod}\nTên: ${userSetting.payoutAccountHolder}\nSTK: ${userSetting.payoutAccountNumber}\n`;

    await bot.sendMessage(
      process.env.TELE_REQUEST_PAYOUT_CHAT_ID,
      `Hey Bazoka Admin, You have a new request affiliate payout from user:\n${username} | ${money}\nChi tiết:\n ${detail}${methodPayout}`,
      options
    );

    responseJson({
      res,
      statusCode: 200,
      message:
        "Yêu cầu rút tiền thành công. Admin sẽ check và tiến hành thanh toán cho bạn.",
      data,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_ACTIONS } = require("../../config/teleActions");
const { decrypt, getTelegramReplyEvent } = require("../../helpers");
const { Hash } = require("../../models/hashSchema");
const { Transaction } = require("../../models/TransactionSchema");
const { User } = require("../../models/UserSchema");
const { UserAffiliate } = require("../../models/UserAffiliateSchema");
const { Wallet } = require("../../models/WalletSchema");

router.post("/", async (req, res) => {
  try {
    const message = req.body.message;
    const callbackQuery = req.body.callback_query;
    const bot = new TelegramBot(process.env.TELE_ACCESS_TOKEN);

    if (message) {
      const chatId = message.chat.id;
      const text = message?.text || "";

      if (text.includes("/deposit")) {
        // Xử lý khi nhận được lệnh /your_command
        await bot.sendMessage(chatId, "Command received and processed.");
      }
    } else if (callbackQuery) {
      const chatId = callbackQuery.message.chat.id;
      const callbackData = await Hash.findById(callbackQuery.data);

      const { event, action, ...data } = decrypt(callbackData.hash);
      console.log({ event, action, data });

      switch (event) {
        case TELEGRAM_ACTIONS.DEPOSIT_MONEY.code:
          const transaction = await Transaction.findById(data.transactionId);

          if (action === TELEGRAM_ACTIONS.DEPOSIT_MONEY.actions.CANCEL.code) {
            transaction.transactionStatus = "REJECT";
            transaction.save();

            await bot.editMessageText(
              `${callbackQuery.message.text}\n<b style="color: red">Từ chối nạp ${data.amount} cho username ${data.username}</b>`,
              {
                chat_id: chatId,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                  inline_keyboard: [],
                },
                parse_mode: "HTML",
              }
            );
          } else if (
            action === TELEGRAM_ACTIONS.DEPOSIT_MONEY.actions.OK.code
          ) {
            transaction.transactionStatus = "SUCCESS";
            transaction.save();

            const wallet = await Wallet.findOne({ username: data.username });
            wallet.amount += data.amount;
            await wallet.save();

            if (data?.refUserId) {
              const refMoney = (data.amount * 15) / 100;
              const refUser = await User.findById(data.refUserId).select(
                "username"
              );
              const refUserWallet = await Wallet.findOne({
                username: refUser.username,
              });
              refUserWallet.affiliateAmount += refMoney;
              await refUserWallet.save();

              const affiliateData = {
                createdUsername: data.username,
                receivedUsername: refUser.username,
                money: data.amount,
                refMoney,
                tracking: "REF_CREATED",
              };

              const affiliate = new UserAffiliate(affiliateData);
              await affiliate.save();
            }

            await bot.editMessageText(
              `${callbackQuery.message.text}\n<b style="color: green">Nạp ${data.amount} cho username ${data.username} thành công</b>`,
              {
                chat_id: chatId,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                  inline_keyboard: [],
                },
                parse_mode: "HTML",
              }
            );
          }

          break;

        case TELEGRAM_ACTIONS.REVIEW_AFFILIATE_PAYOUT.code:
          const { username, amount, affiliateIds } = data;

          await UserAffiliate.updateMany(
            { _id: { $in: affiliateIds } },
            { $set: { tracking: "ADMIN_REVIEW" } }
          );

          const inline_keyboard = await getTelegramReplyEvent({
            event: TELEGRAM_ACTIONS.AFFILIATE_PAID,
            callbackData: {
              username,
              amount,
              affiliateIds,
            },
          });

          await bot.editMessageReplyMarkup(inline_keyboard, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
          });
          break;

        case TELEGRAM_ACTIONS.AFFILIATE_PAID.code:
          console.log({ callbackQuery });
          await UserAffiliate.updateMany(
            { _id: { $in: data.affiliateIds } },
            { $set: { tracking: "ADMIN_PAID" } }
          );

          await bot.editMessageText(
            `${callbackQuery.message.text}\n<b style="font-size: 30px; color: green">UPDATE: Đã thanh toán ${data.amount} cho user ${data.username}</b>`,
            {
              chat_id: chatId,
              message_id: callbackQuery.message.message_id,
              reply_markup: {
                inline_keyboard: [],
              },
              parse_mode: "HTML",
            }
          );
          break;

        default:
          break;
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.log({ error });
    res.sendStatus(500);
  }
});

module.exports = router;

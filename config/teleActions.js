module.exports = {
  TELEGRAM_ACTIONS: {
    DEPOSIT_MONEY: {
      code: "DEPOSIT_MONEY",
      actions: {
        CANCEL: {
          text: "Hủy",
          code: "CANCEL",
        },
        OK: {
          text: "Nạp",
          code: "OK",
        },
      },
    },
    REVIEW_AFFILIATE_PAYOUT: {
      code: "REVIEW_AFFILIATE_PAYOUT",
      actions: {
        REVIEW: {
          text: "Xem xét",
          code: "REVIEW",
        },
      },
    },
    AFFILIATE_PAID: {
      code: "AFFILIATE_PAID",
      actions: {
        PAID: {
          text: "Đã thanh toán",
          code: "PAID",
        },
      },
    },
  },
};

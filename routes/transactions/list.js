const express = require("express");
const { Transaction } = require("../../models/TransactionSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFieldsGetMethod } = require("../../helpers/validateReq");
const router = express.Router();

router.get(
  "/",
  validateDynamicFieldsGetMethod(["username"]),
  async (req, res) => {
    try {
      const { username } = req.query;
      const data = await Transaction.find({
        username,
      }).sort({ createdDate: -1 });

      responseJson({
        res,
        statusCode: 200,
        data,
      });
    } catch (error) {
      console.log({ error });
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

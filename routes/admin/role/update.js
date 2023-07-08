// routes/role/update.js
const express = require("express");
const { Role } = require("../../../models/RoleSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log({ a: req.params });
    const { name, code, description } = req.body;

    const role = await Role.findByIdAndUpdate(
      id,
      { name, code, description },
      { new: true }
    );

    responseJson({
      res,
      statusCode: 200,
      message: "Cập nhật thông tin Role thành công",
      data: role,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

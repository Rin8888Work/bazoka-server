// routes/role/item.js
const express = require("express");
const { Role } = require("#/models/RoleSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      return responseJson({
        res,
        statusCode: 404,
        message: "Không tìm thấy Role",
      });
    }

    responseJson({
      res,
      statusCode: 200,
      message: "Lấy thông tin Role thành công",
      data: role,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;
